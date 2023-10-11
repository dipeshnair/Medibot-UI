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
//   public googleFinds: any [] = [];
  public googleFinds: any[] = [
                       {"Name":"Dr. Abirami Krithiga Jayakumar",
                        "Address":"Metro Station, 157, Anna Salai, Little Mount, Guindy, Chennai, Tamil Nadu 600015, India",
                        "Phone":"N/A",
                        "Rating":"N/A",
                        "Open":"02:00 PM",
                        "Close":"05:00 PM",
                        "ReviewCount":"N/A",
                        "Directions":"https://www.google.com/maps?q=13.654323 , 80.675432"},
                       {"Name":"Dr. Abirami Krithiga Jayakumar",
                        "Address":"Metro Station, 157, Anna Salai, Little Mount, Guindy, Chennai, Tamil Nadu 600015, India",
                        "Phone":"9876543212",
                        "Rating":"5",
                        "Open":"N/A",
                        "Close":"05:00 PM",
                        "ReviewCount":"N/A",
                        "Directions":"https://www.google.com/maps?q=13.654323 , 80.675432"},
                       {"Name":"Dr. Abirami Krithiga Jayakumar",
                        "Address":"Metro Station, 157, Anna Salai, Little Mount, Guindy, Chennai, Tamil Nadu 600015, India",
                        "Phone":"8978675432",
                        "Rating":"5",
                        "Open":"02:00 PM",
                        "Close":"N/A",
                        "ReviewCount":"2",
                        "Directions":"https://www.google.com/maps?q=13.654323 , 80.675432"},
                        {"Name":"Dr. Abirami Krithiga Jayakumar",
                         "Address":"Metro Station, 157, Anna Salai, Little Mount, Guindy, Chennai, Tamil Nadu 600015, India",
                         "Phone":"8978675432",
                         "Rating":"5",
                         "Open":"02:00 PM",
                         "Close":"05:00 PM",
                         "ReviewCount":"2",
                         "Directions":"https://www.google.com/maps?q=13.654323 , 80.675432"}];

  public googleFindContent: any [] = [];

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
      this.messagePrompt.push({message: "I would like find doctor's based on the location", gptMessage: false});
      this.typeOfMessage = 2;
      setTimeout(() => this.messagePrompt.push({message: "Please state your location", gptMessage: true}), 1500);
    } else if (val === 2) {
      this.messagePrompt.push({message: "I would like to continue", gptMessage: false});
      setTimeout(() => this.messagePrompt.push({message: "Please state your health concerns", gptMessage: true}), 1500);
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
      this.messagePrompt.push({message: "Hi, How can I help you? How do you feel today?", gptMessage: true});
      this.chatBox.get('chatPrompt')?.enable();
    }, 1000);
  }

  public getDirection(direction: string) {
      window.open(direction);
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
    this.showGoogleFinds();
    setTimeout(() => this.typeOfMessage = 1, 1000);
//     this._chatBotService.getProvider(data)
//       .subscribe(res => {
//         if (res !== undefined && res !== null) {
//           this.googleFinds = JSON.parse(res);
//           this.showGoogleFinds();
//           console.log("response", this.googleFinds);
//           setTimeout(() => this.typeOfMessage = 1, 1000);
//         }
//       });
  }

  public showGoogleFinds(isRight?: boolean) {
    const array = Array.from(this.googleFinds);
    console.log(array)
    if (isRight === undefined) {
      this.googleFindContent = array.splice(0, 3);
    } else if (isRight && this.googleFindContent.length >= 3) {
      const firstEle = this.googleFinds.indexOf(this.googleFindContent[2]) + 1;
      this.googleFindContent = array.splice(firstEle, 3);
    } else if (!isRight && this.googleFindContent.length >= 1) {
      const firstEle = this.googleFinds.indexOf(this.googleFindContent[0]) - 1;
      this.googleFindContent = array.splice(firstEle, 3)
    }
  }

  private findSpecialization(gptResponse: string) {
    const specialization = ['Anesthesiologist', 'Cardiologist', 'Dermatologist', 'Emergency', 'Medicine',
      'Endocrinologist', 'Gastroenterologist', 'Hematologist', 'Infectious',
      'Internal', 'Neurologist', 'Urologist', 'Obstetrician', 'Gynecologist',
      'Oncologist', 'Ophthalmologist', 'Orthopedics', 'Otolaryngology',
      'Pathologist', 'Pediatrician', 'Physical', 'Rehabilitation',
      'Psychiatrist', 'Pulmonologist', 'Radiologist', 'Rheumatologist', 'Surgery',
      'Urology', 'Addiction', 'Allergist', 'Immunologist', 'Barbaric', 'Cardio-thoracic',
      'Colorectal', 'Family', 'Forensic', 'Geriatrician', 'Interventional',
      'Maternal-Fetal', 'Neonatologist', 'Acupuncturist', 'Physiotherapist', 'Osteopath',
      'cardiomyopathy', 'physiotherapist', 'therapist', 'reflexology', 'osteopath',
      'Arthroscopic', 'Osteoarthritis', 'diabetes', 'Hypothermia', 'Orthopedic Surgeon', 'ENT Specialist',
       'Nephrologist']

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
