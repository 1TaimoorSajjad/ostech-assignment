import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { EmployeesService } from "../../services/employees.service";
import { Employee } from "../../models/employee.model";

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss']
})
export class EmployeeDetailComponent implements OnInit {
  
  form!: FormGroup;
  loading = true;
  employeeId!: string;

  employee: any = {
    id: '',
    firstName: '',
    middleName: '',
    lastName: '',
    client: '',
    ssn: '',
    positionName: '',
    employeeId: '',
    email: '',
    phone: '',
    avatarUrl: 'assets/avatar1.png',
    skills: [],
    tags: [],
    status: 'Active',
    staffing: false,
    gender: '',
    employeeType: '',
    invitationStatus: '',
    w2UseMainAddress: false,
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    },
    payDetails: {
      payRateBasis: 'Hourly',
      payRate: 0,
      weeklyRate: null,
      monthlyRate: null
    },
    locations: [],
    otherInfo: {
      daysPreferences: '',
      shiftPreferences: '',
      reportingTo: '',
      locationPreferences: '',
      availableFrom: '',
      availableTo: '',
      disability: false,
      veteran: false,
      ethnicity: '',
      language: '',
      citizenship: '',
      tobaccoUser: false
    },
    residentialAddress: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    }
  };

  // simple select options
  clients = ['Coco Technologies', 'Lolo Technologies', 'Microsoft', '3M Library Systems', 'Alpha Technologies', 'BlueOrbit Solar'];
  employeeTaxTypes = ['SSN', 'TIN'];
  payRateBases = ['Hourly', 'Weekly', 'Monthly'];

  // UI helpers
  saving = false;

  constructor(
    private fb: FormBuilder, 
    private snack: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private employeesService: EmployeesService
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id') || '';
    if (this.employeeId) {
      this.loadEmployee();
    } else {
      this.loading = false;
    }
  }

  loadEmployee(): void {
    this.loading = true;
    this.employeesService.getEmployees().subscribe({
      next: (employees: Employee[]) => {
        const found = employees.find(e => e.id === this.employeeId);
        if (found) {
          this.employee = {
            ...this.employee,
            id: found.id,
            firstName: found.firstName || '',
            lastName: found.lastName || '',
            client: found.client || '',
            ssn: found.ssn || '',
            email: found.email || '',
            phone: found.phone || '',
            avatarUrl: found.avatarUrl || 'assets/avatar1.png',
            gender: found.gender || '',
            employeeType: found.employeeType || '',
            invitationStatus: found.invitationStatus || '',
            employeeId: `EMP-${found.id}`,
            status: found.invitationStatus === 'Accepted' ? 'Active' : 'Pending'
          };
          this.buildForm();
        } else {
          this.snack.open('Employee not found', 'Close', { duration: 3000 });
          this.router.navigate(['/employees']);
        }
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.snack.open('Failed to load employee', 'Close', { duration: 3000 });
        console.error(err);
      }
    });
  }

  buildForm(): void {
    this.form = this.fb.group({
      client: [this.employee.client],
      employeeTaxType: ['SSN'],
      ssn: [this.employee.ssn],
      positionName: [this.employee.positionName],
      employeeId: [this.employee.employeeId],
      firstName: [this.employee.firstName],
      middleName: [this.employee.middleName],
      lastName: [this.employee.lastName],
      email: [this.employee.email],
      phone: [this.employee.phone],
      w2UseMainAddress: [this.employee.w2UseMainAddress],
      w2AddressLine1: [this.employee.address.line1],
      w2AddressLine2: [this.employee.address.line2],
      w2Zip: [this.employee.address.zip],
      w2City: [this.employee.address.city],
      w2State: [this.employee.address.state],
      payRateBasis: [this.employee.payDetails.payRateBasis],
      payRate: [this.employee.payDetails.payRate],
      weeklyPayRate: [this.employee.payDetails.weeklyRate],
      monthlyPayRate: [this.employee.payDetails.monthlyRate],
      country: [this.employee.address.country],
      zipCode: [this.employee.address.zip],
      city: [this.employee.address.city],
      state: [this.employee.address.state],
      address1: [this.employee.address.line1],
      address2: [this.employee.address.line2],
      daysPreferences: [this.employee.otherInfo.daysPreferences],
      shiftPreferences: [this.employee.otherInfo.shiftPreferences],
      reportingTo: [this.employee.otherInfo.reportingTo],
      availableFrom: [this.employee.otherInfo.availableFrom],
      availableTo: [this.employee.otherInfo.availableTo],
      disability: [this.employee.otherInfo.disability],
      veteran: [this.employee.otherInfo.veteran],
      ethnicity: [this.employee.otherInfo.ethnicity],
      language: [this.employee.otherInfo.language],
      citizenship: [this.employee.otherInfo.citizenship]
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.snack.open('Please fix validation errors before saving', 'Close', { duration: 3000 });
      return;
    }
    this.saving = true;
    const payload = { ...this.employee, ...this.form.value };
    payload.address = {
      line1: this.form.value.address1,
      line2: this.form.value.address2,
      city: this.form.value.city,
      state: this.form.value.state,
      zip: this.form.value.zipCode,
      country: this.form.value.country
    };
    payload.payDetails = {
      payRateBasis: this.form.value.payRateBasis,
      payRate: this.form.value.payRate,
      weeklyRate: this.form.value.weeklyPayRate,
      monthlyRate: this.form.value.monthlyPayRate
    };

    setTimeout(() => {
      this.saving = false;
      this.employee = payload;
      this.snack.open('Employee updated', 'OK', { duration: 2000 });
    }, 700);
  }

  cancel(): void {
    this.buildForm();
    this.snack.open('Changes discarded', 'OK', { duration: 1500 });
  }

  toggleW2MainUse(event: any): void {
    if (event.checked) {
      this.form.patchValue({
        w2AddressLine1: this.form.value.address1,
        w2AddressLine2: this.form.value.address2,
        w2Zip: this.form.value.zipCode,
        w2City: this.form.value.city,
        w2State: this.form.value.state
      });
    }
  }

  removeLocation(index: number): void {
    this.employee.locations.splice(index, 1);
  }

  addSkill(tag: string): void {
    if (!tag) return;
    this.employee.skills = [...(this.employee.skills || []), tag];
  }

  goBack(): void {
    this.router.navigate(['/employees']);
  }
}

