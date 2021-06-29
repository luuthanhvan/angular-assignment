import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	signinForm : FormGroup;
	isLoggedIn : boolean = false;
	isLoginFailed : boolean = false;
	submitted : boolean = false;
	errorMessage : string = '';

	constructor(private formBuilder : FormBuilder,
				private authService : AuthService,
				private router : Router) { }

	ngOnInit() {
		this.signinForm = this.formBuilder.group({
			username: new FormControl('', [Validators.required]),
			password: new FormControl('', [Validators.required, Validators.minLength(6)])
		});
	}

	get signinFormControl(){
		return this.signinForm.controls;
	}

	onSubmit(form: FormGroup){
		this.submitted = true;
		let userInfo = form.value;

		this.authService
			.login(userInfo.username, userInfo.password)
			.subscribe(
				(data) => {
					this.isLoggedIn = true;
					this.isLoginFailed = false;
					this.router.navigate(['/dashboard'])
				},
				(err) => {
					this.errorMessage = err.error.message;
					this.isLoginFailed = true;
					this.isLoggedIn = false;
				}
			);
	}
}
