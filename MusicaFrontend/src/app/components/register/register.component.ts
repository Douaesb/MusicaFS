import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {RouterLink} from "@angular/router";
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AuthState } from 'src/app/state/auth/auth.reducer';
import * as AuthActions from '../../state/auth/auth.action'
import { NgClass, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
    imports: [
      ReactiveFormsModule,
      NgClass,
      NgIf,
      RouterLink,
      NgForOf
    ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  error: string | null = null;
  private readonly subscription: Subscription = new Subscription();
  roles = ['ROLE_USER', 'ROLE_ADMIN'];

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store<{ auth: AuthState }>
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      roles: [['ROLE_USER'], [Validators.required]]
    });
  }

  ngOnInit() {
    this.subscription.add(
      this.store.select(state => state.auth).subscribe(authState => {
        this.loading = authState.loading;
        this.error = authState.error;
      })
    );
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { username, roles, password } = this.registerForm.value;
      const formattedRoles = Array.isArray(roles) ? roles : roles.split(',')
      this.store.dispatch(AuthActions.register({ username, password, roles: formattedRoles }));
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
