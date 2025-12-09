import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-drawer',
  templateUrl: './employee-drawer.component.html',
  styleUrls: ['./employee-drawer.component.scss']
})
export class EmployeeDrawerComponent implements OnChanges {
  @Input() employee: Employee | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Employee>();

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  formData = {
    client: '',
    worksiteLocation: '',
    payGroup: '',
    taxType: '',
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    gender: '',
    maritalStatus: '',
    dateOfBirth: ''
  };

  clients = ['3M Library Systems', 'Alpha Technologies', 'BlueOrbit Solar'];
  worksiteLocations = ['New York', 'Los Angeles', 'Chicago'];
  payGroups = ['Weekly', 'Bi-Weekly', 'Monthly'];
  taxTypes = ['W2', '1099'];
  genders = ['Male', 'Female', 'Other'];
  maritalStatuses = ['Single', 'Married', 'Divorced'];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employee'] && this.employee) {
      this.formData = {
        client: this.employee.client || '',
        worksiteLocation: '',
        payGroup: '',
        taxType: '',
        firstName: this.employee.firstName || '',
        middleName: '',
        lastName: this.employee.lastName || '',
        email: this.employee.email || '',
        phoneNumber: this.employee.phone || '',
        gender: this.employee.gender || '',
        maritalStatus: '',
        dateOfBirth: ''
      };
      this.previewUrl = this.employee.avatarUrl || null;
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onBrowseClick(): void {
    const fileInput = document.getElementById('photoInput') as HTMLInputElement;
    fileInput?.click();
  }

  onCancel(): void {
    this.resetForm();
    this.close.emit();
  }

  onSave(): void {
    const employeeData: Employee = {
      id: this.employee?.id || '',
      firstName: this.formData.firstName,
      lastName: this.formData.lastName,
      gender: this.formData.gender,
      client: this.formData.client,
      employeeType: 'Full Time',
      ssn: '',
      email: this.formData.email,
      phone: this.formData.phoneNumber,
      avatarUrl: this.previewUrl || '',
      invitationStatus: 'Not Invited'
    };
    this.saved.emit(employeeData);
    this.resetForm();
  }

  resetForm(): void {
    this.formData = {
      client: '',
      worksiteLocation: '',
      payGroup: '',
      taxType: '',
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      gender: '',
      maritalStatus: '',
      dateOfBirth: ''
    };
    this.selectedFile = null;
    this.previewUrl = null;
  }

  get isEditMode(): boolean {
    return !!this.employee;
  }
}