import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class ChatBotService {

  constructor(protected httpClient: HttpClient) { }

  public sendMessage(message: string) {
    return this.httpClient.post<any>("http://127.0.0.1:5000/gpt", message);
  }

  public getProvider(data: any) {
    return this.httpClient.post<any>("http://127.0.0.1:5000/gpt/loc", data);
  }

}
