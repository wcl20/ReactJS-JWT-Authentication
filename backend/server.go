package main

import(
  "encoding/json"
  "log"
  "net/http"
  "strings"
  "time"
  "github.com/dgrijalva/jwt-go"
  "github.com/gorilla/handlers"
  "github.com/gorilla/mux"
)

// List of valid users in database
var users = map[string]string {
  "admin": "1234",
}

// Create JWT key for creating the signature
var jwtKey = []byte("secret_key")

// Create struct to read credentials of POST body
type Credentials struct {
  Username string `json:"username"`
  Password string `json:"password"`
}

// Create struct that will be encoded to JWT
type Claims struct {
  Username string
  jwt.StandardClaims
}

// Create response struct to return JSON
type Response struct {
  Message string `json:"message"`
}

// Generates an access token and a refresh token
func returnTokens(w http.ResponseWriter, username string) {
  // Create JWT (Lasts for 10 seconds)
  expiration := time.Now().Add(10 * time.Second)
  claims := &Claims {
    Username: username,
    StandardClaims: jwt.StandardClaims{
      ExpiresAt: expiration.Unix(),
    },
  }
  accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
  accessTokenString, err := accessToken.SignedString(jwtKey)
  if err != nil {
    w.WriteHeader(http.StatusInternalServerError)
	  return
  }

  // Create Refresh token (Lasts for 24 hours)
  expiration = time.Now().Add(20 * time.Second)
  claims = &Claims {
    Username: username,
    StandardClaims: jwt.StandardClaims{
      ExpiresAt: expiration.Unix(),
    },
  }
  refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
  refreshTokenString, err := refreshToken.SignedString(jwtKey)
  if err != nil {
    w.WriteHeader(http.StatusInternalServerError)
	  return
  }

  // Return refresh token in cookie
  http.SetCookie(w, &http.Cookie {
    Name: "token",
    Value: refreshTokenString,
    Expires: expiration,
  })

  // Return access token in JSON
  response, err := json.Marshal(Response { Message: accessTokenString })
  if err != nil {
    w.WriteHeader(http.StatusInternalServerError)
	  return
  }
  w.Header().Set("Content-Type", "application/json")
  w.WriteHeader(http.StatusOK)
  w.Write(response)
}


// Verifies tokens sent from user
func verifyToken(tokenString string) *Claims {
  // Check valid token
  token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
    return []byte(jwtKey), nil
  })
  if err != nil {
    return nil
  }
  if claims, ok := token.Claims.(*Claims); ok && token.Valid {
    return claims
  } else {
    return nil
  }
}

/******************************************************************************
* Handlers
******************************************************************************/

func loginHandler(w http.ResponseWriter, r *http.Request) {
  // Read credentials from request body
  var credentials Credentials
  err := json.NewDecoder(r.Body).Decode(&credentials)
  if err != nil {
    w.WriteHeader(http.StatusBadRequest)
    return
  }
  // Get stored password of user
  password, ok := users[credentials.Username]
  // Check user exists and password is valid
  if !ok || credentials.Password != password {
    w.WriteHeader(http.StatusUnauthorized)
    return
  }
  // Return access token and refresh token
  returnTokens(w, credentials.Username)
}

func refreshHandler(w http.ResponseWriter, r *http.Request) {
  // Get refresh token from cookie
  cookie, err := r.Cookie("token")
  if err != nil {
    w.WriteHeader(http.StatusBadRequest)
    return
  }
  // Check valid token
  if claims := verifyToken(cookie.Value); claims != nil {
    // Check JWT is expired. JWT expires 10 seconds before refresh token.
    // If JWT has not expired and client requested a refresh, JWT is invalid.
    if time.Unix(claims.StandardClaims.ExpiresAt, 0).Sub(time.Now()) > 10 * time.Second {
  		w.WriteHeader(http.StatusUnauthorized)
  		return
	  }
    // Return access token and refresh token
    returnTokens(w, claims.Username)
  } else {
    w.WriteHeader(http.StatusUnauthorized)
    return
  }
}

func dataHandler(w http.ResponseWriter, r *http.Request) {
  response, err := json.Marshal(Response { Message: "Data from server." })
  if err != nil {
    w.WriteHeader(http.StatusInternalServerError)
	  return
  }
  w.Header().Set("Content-Type", "application/json")
  w.WriteHeader(http.StatusOK)
  w.Write(response)
}

/******************************************************************************
* Middleware for checking Authorization header
******************************************************************************/

func middleware(next http.Handler) http.Handler {
  return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    authorization := strings.Split(r.Header.Get("Authorization"), "Bearer ")
    // Check malformed token
    if len(authorization) != 2 {
      w.WriteHeader(http.StatusBadRequest)
      return
    }
    // Check valid token
    if verifyToken(authorization[1]) != nil {
      next.ServeHTTP(w, r)
    } else {
      w.WriteHeader(http.StatusUnauthorized)
      return
    }
  })
}

func main() {
  router := mux.NewRouter()
  router.HandleFunc("/login", loginHandler).Methods("POST")
  router.HandleFunc("/refresh", refreshHandler).Methods("GET")
  router.Handle("/data", middleware(http.HandlerFunc(dataHandler))).Methods("GET")
  log.Fatal(http.ListenAndServe(":8080", handlers.CORS(
    handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"}),
    handlers.AllowedOrigins([]string{"http://localhost:3000"}),
    handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "OPTIONS"}),
    handlers.AllowCredentials())(router)))
}
