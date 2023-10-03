import { Component } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ChatBotService} from "../../core/services/chat-bot.service";

@Component({
  selector: 'app-home',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.css']
})
export class ChatBotComponent {

  public chatBox: FormGroup;
  public messagePrompt: string [] = [];
  public gptReply: string [] = [];

  constructor(private _fb: FormBuilder,
              private _chatBotService: ChatBotService) {
    this.chatBox = _fb.group({
      chatPrompt: [{value: "", disabled: false}]
    });
  }

  public onSubmit() {
    console.log("submit");
    console.log(this.chatBox.value.chatPrompt);
    const message = this.chatBox.value.chatPrompt
    if (message != null && message) {
      this.messagePrompt.push(message);
      this.gptReply.push("reply from gpt " + message);
      // setTimeout(() => this.chatBox.get('chatPrompt')?.enable(), 3000)
      this._chatBotService.sendMessage(message)
        .subscribe(response => {

      });
    }
    this.chatBox.get('chatPrompt')?.reset();
    const currentValue = this.chatBox.get('chatPrompt')?.value;
    this.chatBox.get('chatPrompt')?.disable();
    const sanitizedValue = currentValue.replace(/\n/g, ''); // Remove newline characters
    this.chatBox.get('chatPrompt')?.setValue(sanitizedValue);
  }
}
