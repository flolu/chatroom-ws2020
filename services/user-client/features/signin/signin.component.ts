import {Component} from '@angular/core'
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {Store} from '@ngrx/store'

import {AuthActions, AuthSelectors} from '@store'

@Component({
  selector: 'app-signin',
  template: `
    <div class="container">
      <h2>Sign in</h2>
      <form [formGroup]="form" (submit)="signIn()">
        <input formControlName="username" placeholder="Username" />
        <input formControlName="password" type="password" placeholder="Password" />
        <button>Submit</button>
      </form>
      <p *ngIf="error$ | async as err" class="error">{{ err }}</p>
    </div>
  `,
  styleUrls: ['signin.component.sass'],
})
export class SigninComponent {
  error$ = this.store.select(AuthSelectors.signInError)
  form = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  })

  constructor(private store: Store) {}

  signIn() {
    if (this.form.valid) {
      const {username, password} = this.form.value
      this.store.dispatch(AuthActions.signIn({username, password}))
    }
  }
}
