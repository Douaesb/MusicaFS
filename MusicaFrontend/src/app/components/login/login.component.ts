import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {RouterLink} from "@angular/router";
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AuthState } from 'src/app/state/auth/auth.reducer';
import * as AuthActions from '../../state/auth/auth.action'
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
    imports: [
      ReactiveFormsModule,
        RouterLink,
        NgClass,
        NgIf,
    ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error: string | null = null;
  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly fb: FormBuilder , private readonly store: Store<{ auth: AuthState }>) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    })
  }
  ngOnInit(): void {
    this.subscription.add(
      this.store.select(state => state.auth).subscribe(authState => {
        this.loading = authState.loading;
        this.error = authState.error;
      })
    )
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.store.dispatch(AuthActions.login({ username, password }));
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
