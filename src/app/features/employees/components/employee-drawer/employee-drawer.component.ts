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
import { EmployeesService } from '../../services/employees.service';

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

  avatarPreview: string | null = null;
  avatarFile: File | null = null;

  clients = ['3M Library Systems', 'Alpha Technologies', 'BlueOrbit Solar'];
  payGroups = ['Weekly', 'Bi-Weekly', 'Monthly'];
  worksiteLocations = ['NYC Office', 'Remote', 'LA Office'];
  taxTypes = ['W-2', '1099'];
  genders = ['Female', 'Male', 'Other'];
  maritalStatuses = ['Single', 'Married', 'Divorced'];
  employmentTypes = ['Full Time', 'Part Time', 'Contract'];

  constructor(private fb: FormBuilder, private employeeService: EmployeesService) { }

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
      employeeType: [null, Validators.required],
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

    this.form.patchValue({...emp});

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

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload =this.form.value
    this.employeeService.createEmployee(payload, this.employee?.id).subscribe({
      next: (response:any) => {
        this.saved.emit(response);
      },
      error: (_err) => {
      }
    });
  }

  onCancelClick(): void {
    this.cancel.emit();
  }
}
