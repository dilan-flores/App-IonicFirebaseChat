import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  credentialForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private router: Router,
    private chatService: ChatService) {}

  ngOnInit() {
    console.log('Initializing HomePage');
  }
  home(user: string) {
    this.chatService
    .signIn(user);
    this.router.navigate(['chat']);
  }
}