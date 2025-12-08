export interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    gender: string,
    client: string,
    employeeType: string,
    ssn: string,
    email: string,
    phone: string,
    avatarUrl: string,
    invitationStatus: string;
}

export interface EmployeeResponse {
  status: string;
  data: Employee[];
  message: string;
}

export interface SingleEmployeeResponse {
  status: string;
  data: Employee;
  message: string;
}
