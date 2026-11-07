# User Operational Manual & Feature Walkthrough
**Institute of Engineering & Management, Kolkata**  
*Library Management System*

---

## 1. System Access & Navigation

The IEM Library Management System provides a unified web portal accessible at `http://localhost:5173` (or your configured production domain).

### Navigation Bar
The top header provides instant access to:
- **Official IEM Emblem**: Links directly to the institutional landing page.
- **Catalog**: Comprehensive directory of all academic holdings.
- **Search Bar**: Real-time filtering across titles, authors, and accession numbers.
- **Portal Status / User Profile**: Indicates currently active user role (`Librarian` or `Student Patron`) and logout trigger.

---

## 2. Public Catalog & Book Discovery

1. Navigate to **Catalog** or scroll to the catalog section on the landing page.
2. **Search**: Enter keywords into the search box. Filtering is instantaneous.
3. **Availability Badges**:
   - `Available (N copies)`: Green badge indicating physical copies are on the shelf.
   - `Checked Out`: Amber badge indicating all copies are currently in circulation.
4. **Interactive 3D Book View**: Click any book card to open the 3D book modal, displaying complete publication metadata, ISBN/Accession code, summary, and borrowing guidelines.

---

## 3. Authentication & Account Access

1. Click **Sign In** in the top navigation bar.
2. You will be greeted by the **Living Library** animated login experience.
3. Choose your profile role:
   - **Student Patron**: Use your student email (`alex@iemcal.ac.in`) or student ID (`S101`) with password `student123`.
   - **Librarian / Staff**: Use staff email (`librarian@iemcal.ac.in`) or staff ID (`LIB001`) with password `admin123`.
4. Click **Sign In**. Upon successful verification, you are automatically redirected to your designated portal.

---

## 4. Student Patron Portal

The Student Portal (`/student`) gives enrolled students complete visibility over their borrowing activities:
- **Active Loans Card**: Displays all books currently in the student's possession, checkout dates, and return deadlines.
- **Total Borrowed Statistics**: Complete count of all titles borrowed throughout the student's academic tenure.
- **Loan History Audit**: Historical ledger of returned books and circulation records.
- **Quick Renewal / Return Request**: Allows students to initiate return processing or view librarian contact details.

---

## 5. Librarian Administration Console

The Librarian Dashboard (`/admin`) provides full circulation desk capabilities:
- **Circulation Analytics**: Real-time counters showing Total Catalog Holdings, Shelf Available Copies, Total Issued Copies, and Registered Student Patrons.
- **Issue Book**:
  1. Select or input the Book Accession ID (e.g. `B101`).
  2. Select or input the Student Patron ID (e.g. `S101`).
  3. Click **Issue Book**. The system verifies that `availableCopies >= 1`, atomically decrements inventory, and creates a timestamped transaction record.
- **Return Book**:
  1. Locate the active borrowing record in the **Active Loans** table.
  2. Click **Process Return**. The system verifies the active loan, marks status as `RETURNED`, and restores the shelf copy count.
- **Add / Edit Books**: Add new titles to the catalog with title, author, publication year, and total copy count.
- **Student Registry Audit**: View all registered students and their active circulation statuses.

---

## 6. Kotlin Console Terminal Client

For quick terminal-based administration, launch `scripts/start-console.bat` (or `./scripts/start-console.sh`):
1. **Option 1**: Display all books in catalog.
2. **Option 2**: Add a new book to inventory.
3. **Option 3**: Register a new student patron.
4. **Option 4**: Issue book to student.
5. **Option 5**: Return book.
6. **Option 6**: View active circulation loans.
7. **Option 7**: View circulation audit logs.
8. **Option 8**: Exit.
