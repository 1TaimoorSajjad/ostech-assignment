import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-drawer',
  templateUrl: './employee-drawer.component.html',
  styleUrls: ['./employee-drawer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeDrawerComponent implements OnInit, OnChanges {
  @Input() employee: Employee | null = null;
  @Output() saved = new EventEmitter<Employee>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  saving = false;

  // upload preview
  avatarPreview: string | null = null;
  avatarFile: File | null = null;

  // dummy select options - replace or feed from parent if needed
  clients = ['3M Library Systems', 'Alpha Technologies', 'BlueOrbit Solar'];
  payGroups = ['Weekly', 'Bi-Weekly', 'Monthly'];
  worksiteLocations = ['NYC Office', 'Remote', 'LA Office'];
  taxTypes = ['W-2', '1099'];
  genders = ['Female', 'Male', 'Other'];
  maritalStatuses = ['Single', 'Married', 'Divorced'];
  employmentTypes = ['Full Time', 'Part Time', 'Contract'];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employee'] && !changes['employee'].isFirstChange()) {
      this.resetFor(this.employee);
    } else if (this.employee && !this.form) {
      this.buildForm();
      this.resetFor(this.employee);
    }
  }

  private buildForm(): void {
    this.form = this.fb.group({
      client: [null, Validators.required],
      worksiteLocation: [null, Validators.required],
      payGroup: [null, Validators.required],
      taxType: [null, Validators.required],
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      gender: [null, Validators.required],
      maritalStatus: [null, Validators.required],
      dob: [null, Validators.required],
      originalHireDate: [null, Validators.required],
      employmentType: [null, Validators.required],
      zipCode: [''],
      city: [''],
      state: [''],
      address1: [''],
      address2: [''],
      country: [null],
    });
  }

  private resetFor(emp: Employee | null): void {
    if (!this.form) this.buildForm();
    if (!emp) {
      this.form.reset();
      this.avatarPreview = null;
      this.avatarFile = null;
      return;
    }

    this.form.patchValue({
      client: (emp as any).client ?? null,
      worksiteLocation: (emp as any).worksiteLocation ?? null,
      payGroup: (emp as any).payGroup ?? null,
      taxType: (emp as any).taxType ?? null,
      firstName: emp.firstName ?? '',
      middleName: (emp as any).middleName ?? '',
      lastName: emp.lastName ?? '',
      email: emp.email ?? '',
      phone: emp.phone ?? '',
      gender: (emp as any).gender ?? null,
      maritalStatus: (emp as any).maritalStatus ?? null,
      dob: (emp as any).dob ? this.asDateValue((emp as any).dob) : null,
      originalHireDate: (emp as any).originalHireDate ? this.asDateValue((emp as any).originalHireDate) : null,
      employmentType: (emp as any).employmentType ?? null,
      zipCode: (emp as any).zipCode ?? '',
      city: (emp as any).city ?? '',
      state: (emp as any).state ?? '',
      address1: (emp as any).address1 ?? '',
      address2: (emp as any).address2 ?? '',
      country: (emp as any).country ?? null
    });

    this.avatarPreview = emp.avatarUrl ?? null;
    this.avatarFile = null;
  }

  private asDateValue(value: string | Date): string {
    const d = value ? new Date(value) : new Date();
    const mm = (d.getMonth() + 1).toString().padStart(2, '0');
    const dd = d.getDate().toString().padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
  }

  onFilePicked(event: Event | FileList | null): void {
    let file: File | null = null;
    if (!event) return;
    if ((event as FileList).length !== undefined) {
      file = (event as FileList)[0] ?? null;
    } else {
      const input = event as unknown as HTMLInputElement;
      file = input?.files?.[0] ?? null;
    }
    if (!file) return;
    this.avatarFile = file;
    this.previewFile(file);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files?.length) {
      this.onFilePicked(event.dataTransfer.files);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  private previewFile(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.avatarPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  // ---------- Save / Cancel ----------
  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;

    // build employee object from form
    const payload: Employee = {
      id: this.employee ? this.employee.id : '',
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      email: this.form.value.email,
      phone: this.form.value.phone,
      avatarUrl: this.avatarPreview ?? (this.employee ? this.employee.avatarUrl : undefined),
  
    } as Employee & any;

    (payload as any).client = this.form.value.client;
    (payload as any).worksiteLocation = this.form.value.worksiteLocation;
    (payload as any).payGroup = this.form.value.payGroup;
    (payload as any).taxType = this.form.value.taxType;
    (payload as any).middleName = this.form.value.middleName;
    (payload as any).gender = this.form.value.gender;
    (payload as any).maritalStatus = this.form.value.maritalStatus;
    (payload as any).dob = this.form.value.dob;
    (payload as any).originalHireDate = this.form.value.originalHireDate;
    (payload as any).employmentType = this.form.value.employmentType;
    (payload as any).zipCode = this.form.value.zipCode;
    (payload as any).city = this.form.value.city;
    (payload as any).state = this.form.value.state;
    (payload as any).address1 = this.form.value.address1;
    (payload as any).address2 = this.form.value.address2;
    (payload as any).country = this.form.value.country;

    setTimeout(() => {
      this.saving = false;
      this.saved.emit(payload);
    }, 600);
  }

  onCancelClick(): void {
    this.cancel.emit();
  }
}
