import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { TodoItem } from "../../models/TodoItem";
import { TodoServiceProvider } from "../../services/todos.service";
import { SpeechRecognition } from "@ionic-native/speech-recognition";
import { ChangeDetectorRef } from "@angular/core";

@Component({
  selector: "page-edit-todo",
  templateUrl: "edit-todo.html"
})
export class EditTodoPage {
  todoEditForm: any;
  todoItem: TodoItem = { name: "", complete: false, desc: "", uuid: "" };
  listUuid: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private todoServiceProvider: TodoServiceProvider,
    private speechRecognition: SpeechRecognition,
    private cd: ChangeDetectorRef
  ) {
    this.todoItem = this.navParams.get("todoItem");
    this.listUuid = this.navParams.get("listUuid");

    this.todoEditForm = this.formBuilder.group({
      title: [this.todoItem.name, Validators.required],
      description: [this.todoItem.desc]
    });
  }

  onEditTodo() {
    this.todoItem.name = this.todoEditForm.value.title;
    this.todoItem.desc = this.todoEditForm.value.description;
    this.todoServiceProvider.editTodo(this.listUuid, this.todoItem);
    this.navCtrl.pop();
  }

  private getPermission() {
    this.speechRecognition.hasPermission().then((hasPermission: boolean) => {
      if (!hasPermission) {
        this.speechRecognition
          .requestPermission()
          .then(() => console.log("Granted"), () => console.log("Denied"));
      } else {
        console.log("has permission");
      }
    });
  }

  private startListening() {
    let options = {
      language: "fr-FR"
    };
    this.getPermission();
    this.speechRecognition.startListening(options).subscribe(
      matches => {
        this.todoEditForm.controls["title"].setValue(matches.pop());
        this.cd.detectChanges();
      },
      error => console.log(error)
    );
  }
}
