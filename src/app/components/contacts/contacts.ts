import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CONTACT_INFO } from '../../data/contact.data';
import { PageHeroComponent } from '../../shared/ui';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, PageHeroComponent],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss'
})
export class Contacts  {
  contactForm: FormGroup;
  isSubmitting = false;
  submissionSuccess = false;
  selectedFile: File | null = null;
  selectedFileName = '';

  contactInfo = CONTACT_INFO;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\-\s()]+$/)]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  getFieldNameError(): string {
    const name = this.contactForm.get('name');
    if (!name) return '';
    if (name.hasError('required')) return 'Name is required';
    if (name.hasError('minlength')) return 'Name must be at least 2 characters';
    return '';
  }

  getEmailError(): string {
    const email = this.contactForm.get('email');
    if (!email) return '';
    if (email.hasError('required')) return 'Email is required';
    if (email.hasError('email')) return 'Please enter a valid email';
    return '';
  }

  getPhoneError(): string {
    const phone = this.contactForm.get('phone');
    if (!phone) return '';
    if (phone.hasError('required')) return 'Phone is required';
    if (phone.hasError('pattern')) return 'Please enter a valid phone number';
    return '';
  }


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      this.removeSelectedFile();
      return;
    }

    this.selectedFile = file;
    this.selectedFileName = file.name;
  }

  removeSelectedFile(): void {
    this.selectedFile = null;
    this.selectedFileName = '';

    const input = document.getElementById('attachment') as HTMLInputElement | null;
    if (input) {
      input.value = '';
    }
  }

  async onSubmit() {
    if (this.contactForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    this.submissionSuccess = false;

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Form submitted:', { ...this.contactForm.value, attachment: this.selectedFile });
    
    this.isSubmitting = false;
    this.submissionSuccess = true;
    this.contactForm.reset();
    this.removeSelectedFile();

    // Hide success message after 5 seconds
    setTimeout(() => {
      this.submissionSuccess = false;
    }, 5000);
  }
}

