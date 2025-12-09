import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Employee } from '../../models/employee.model';
import { EmployeesService } from '../../services/employees.service';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss']
})
export class EmployeesListComponent implements OnInit {
  displayedColumns: string[] = [
    'select',
    'name',
    'actions',
    'client',
    'employeeType',
    'ssn',
    'email',
    'phone',
    'invitationStatus',
  ];

  dataSource = new MatTableDataSource<any>([]);

  loading = false;
  error: string | null = null;

  page = 0;
  size = 15;
  total = 0;

  query = '';

  @ViewChild('drawer') drawer?: MatSidenav;
  editingEmployee: Employee | null = null;

  private dummyEmployees: Employee[] = [
    {
      id: '1',
      firstName: 'Aliah',
      lastName: 'Lane',
      gender: 'Female',
      client: '3M Library Systems',
      employeeType: 'Full Time',
      ssn: '7890',
      email: 'aliah@gmail.com',
      phone: '+1-212-534-7890',
      avatarUrl: 'assets/avatar1.png',
      invitationStatus: 'Not Invited'
    },
    {
      id: '2',
      firstName: 'Drew',
      lastName: 'Cano',
      gender: 'Male',
      client: 'Alpha Technologies',
      employeeType: 'Part Time',
      ssn: '5960',
      email: 'drew@yahoo.com',
      phone: '+1-212-678-9012',
      avatarUrl: 'assets/avatar2.png',
      invitationStatus: 'Accepted'
    },
    {
      id: '3',
      firstName: 'Kiara',
      lastName: 'Mills',
      gender: 'Female',
      client: 'BlueOrbit Solar',
      employeeType: 'Contract',
      ssn: '1234',
      email: 'kiara@blueorbit.com',
      phone: '+1-310-342-8861',
      avatarUrl: 'assets/avatar3.png',
      invitationStatus: 'Accepted'
    }
  ];

  constructor(private employeeService: EmployeesService) {}

  ngOnInit(): void {
      this.getEmployees();
  }

  getEmployees(){
    this.employeeService.getEmployees().subscribe({
      next: (response) => {
        let filtered = [...response];

        // SEARCH
        if (this.query.trim()) {
          const q = this.query.trim().toLowerCase();
          filtered = filtered.filter(e =>
            `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
            e.email.toLowerCase().includes(q) ||
            e.client.toLowerCase().includes(q)
          );
        }

        this.total = filtered.length;
        const start = this.page * this.size;
        const end = start + this.size;
        const paged = filtered.slice(start, end);

        const mapped = paged.map(e => ({
          ...e,
          ssnMasked: `***${e.ssn}`
        }));

        this.dataSource.data = mapped;
        this.loading = false;
      },
      error: (_err) => {
        this.error = 'Failed to load employees';
        this.loading = false;
      }
    });
  }


  onSearch(term: string): void {
    this.query = term;
    this.page = 0;
    this.getEmployees();
  }

  openAdd(): void {
    console.log("Button click", this.drawer);
    this.editingEmployee = null;
    this.drawer?.open();
  }

  openEdit(employee: Employee): void {
    this.editingEmployee = employee;
    this.drawer?.open();
  }

  openRowMenu(row: Employee): void {
    console.log('Menu clicked:', row);
  }

  openDetail(row: Employee): void {
    console.log('Open detail for:', row);
  }

  // SAVE CALLBACK FROM DRAWER
  onSaved(): void {
    this.drawer?.close();
    // this.load();
  }

  deleteEmployee(emp: Employee): void {
    if (!confirm(`Delete ${emp.firstName}?`)) return;
    this.dummyEmployees = this.dummyEmployees.filter(e => e.id !== emp.id);
    // this.load();
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.total / this.size));
  }

  get pages(): number[] {
    const total = this.totalPages;
    const visible = 10;
    const max = Math.min(visible, total);
    return Array.from({ length: max }, (_, i) => i + 1);
  }

  goToPrevious(): void {
    if (this.page === 0) return;
    this.page--;
    this.getEmployees();
  }

  goToNext(): void {
    if (this.page + 1 >= this.totalPages) return;
    this.page++;
    this.getEmployees();
  }

  goToPage(p: number): void {
    const newPage = p - 1;
    if (newPage === this.page) return;
    this.page = newPage;
    this.getEmployees();
  }
}
