import { Component } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-home',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.css']
})
export class ChatBotComponent {

  public chatBox: FormGroup;

  constructor(private _fb: FormBuilder) {
    this.chatBox = _fb.group({
      chatPrompt: ""
    });
  }

  public onSubmit() {
    console.log("submit");
  }
}
