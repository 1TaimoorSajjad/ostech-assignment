import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
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


  constructor(private employeeService: EmployeesService, private router: Router) {}

  ngOnInit(): void {
      this.getEmployees();
  }

  getEmployees(){
    this.employeeService.getEmployees().subscribe({
      next: (response) => {
        let filtered = [...response];

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
    this.router.navigate(['/employees', row.id]);
  }

  onSaved(evt: Employee): void {
    const index = this.dataSource.data.findIndex(e => e.id === evt.id);
    if (index !== -1) {
      this.dataSource.data[index] = { ...evt, ssnMasked: `***${evt.ssn}` };
      this.dataSource.data = [...this.dataSource.data];
    } else {
      this.getEmployees();
    }
    this.drawer?.close();
  }


  deleteEmployee(emp: Employee): void {
    this.employeeService.deleteEmployee(emp.id).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter(e => e.id !== emp.id);
      },
      error: (_err) => {
        console.error('Failed to delete employee', _err);
      }
    });
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
