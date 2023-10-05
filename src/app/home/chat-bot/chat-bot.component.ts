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
  public messagePrompt: ChatMessage [] = [];
  public chatInitiated: boolean = false;
  public typeOfMessage: number = 0;
  public specializationRequest: string [] = [];
  public googleFinds: [] = [];

  constructor(private _fb: FormBuilder,
              private _chatBotService: ChatBotService) {
    this.chatBox = _fb.group({
      chatPrompt: [{value: "", disabled: false}]
    });
    this.chatBox.get('chatPrompt')?.disable();
  }

  public onSubmit() {
    const message = this.chatBox.value.chatPrompt
    if (message != null && message) {
      this.messagePrompt.push({message: message, gptMessage: false});

      if (this.typeOfMessage === 0) {
        this.sendMessageToGpt(message);
      } else if (this.typeOfMessage === 2) {
        this.findProvidersLocation(message);
        // do other type of message
      }
    }
    this.resetInput();
  }

  public onSuggestion(val: number) {
    if (val === 1) {
      this.messagePrompt.push({message: "Find providers by location", gptMessage: false});
      this.typeOfMessage = 2;
      setTimeout(() => this.messagePrompt.push({message: "Please state your location", gptMessage: true}), 1500);
    } else if (val === 2) {
      this.messagePrompt.push({message: "I want to share my other problems", gptMessage: false});
      setTimeout(() => this.messagePrompt.push({message: "Please state your symptoms or problems", gptMessage: true}), 1500);
      this.typeOfMessage = 0;
    } else if (val == 3) {
      this.chatInitiated = false;
      this.messagePrompt = [];
      this.typeOfMessage = 0;
    }
  }

  public getStarted() {
    this.chatInitiated = true;
    this.messagePrompt.push({message: "Hi Medibot", gptMessage: false});
    setTimeout(() => {
      this.messagePrompt.push({message: "Hi, Please state your symptoms or problems", gptMessage: true});
      this.chatBox.get('chatPrompt')?.enable();
    }, 1000);
  }

  private resetInput() {
    this.chatBox.get('chatPrompt')?.reset();
    const currentValue = this.chatBox.get('chatPrompt')?.value;
    this.chatBox.get('chatPrompt')?.disable();
    const sanitizedValue = currentValue.replace(/\n/g, ''); // Remove newline characters
    this.chatBox.get('chatPrompt')?.setValue(sanitizedValue);
  }

  private sendMessageToGpt(message: string) {
    this._chatBotService.sendMessage(message)
      .subscribe(response => {
        if (response !== undefined && response !== null) {
          console.log("response", response);
          this.messagePrompt.push({message: response.message, gptMessage: true});
          this.chatBox.get('chatPrompt')?.enable();
          setTimeout(() => this.typeOfMessage = 1, 1000);
          this.findSpecialization(message);
        }
      });
  }

  private findProvidersLocation(message: string) {
    const data = {
      location : message,
      specialization: this.specializationRequest.toString()
    }
    this._chatBotService.getProvider(data)
      .subscribe(res => {
        if (res !== undefined && res !== null) {
          this.googleFinds = JSON.parse(res);
          console.log("response", this.googleFinds);
        }
        // 'Name': Name,
        //   'Address': Address,
        //   'Phone': Phone,
        //   'Rating': Rating,
        //   'Open': open,
        //   'Close': close,
        //   'ReviewCount': review_count,
        //   'MapDirection': map_direction
      });
  }

  private findSpecialization(gptResponse: string) {
    const specialization = ['Anesthesiologist', 'Cardiologist', 'Dermatologist', 'Emergency', 'Medicine',
      'Endocrinologist', 'Gastroenterologist', 'Hematologist', 'Infectious',
      'Internal', 'Neurologist', 'Neurologist', 'Obstetrics', 'Gynecologist',
      'Oncologist', 'Ophthalmology', 'Orthopedics', 'Otolaryngology',
      'Pathologist', 'Pediatrics', 'Physical', 'Rehabilitation',
      'Psychiatry', 'Pulmonologist', 'Radiologist', 'Rheumatologist', 'Surgery',
      'Urology', 'Addiction', 'Allergy', 'Immunologist', 'Barbaric', 'Cardio-thoracic',
      'Colorectal', 'Family', 'Forensic', 'Geriatrics', 'Interventional',
      'Maternal-Fetal', 'Neonatologist', 'Acupuncturist', 'Physiotherapist', 'Osteopath',
      'cardiomyopathy', 'physiotherapist', 'therapist', 'reflexology', 'osteopath',
      'Arthroscopic', 'Osteoarthritis', 'diabetes', 'Hypothermia']

    const gptResponseList = gptResponse.split(" ");
    console.log(gptResponseList);
    gptResponseList.forEach((res: string) => {
      if (specialization.includes(res)) {
        this.specializationRequest.push(res);
      }
    });
    if (this.specializationRequest.length === 0) {
      this.specializationRequest.push("general");
    }
  }
}

interface ChatMessage {
  message: string;
  gptMessage: boolean;

}
