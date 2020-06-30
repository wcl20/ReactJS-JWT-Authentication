import { DATA } from "../constants/actionTypes";
import { dataServices } from "../services/data"

export function getData() {
  return { type: DATA, httpService: dataServices.getData, params: [] };
}
