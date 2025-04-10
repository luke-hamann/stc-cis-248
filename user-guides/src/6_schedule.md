# Schedule

## Schedule Year Calendar

![The schedule year calendar](./images/schedule_year.png)

The schedule year calendar allows you to navigate through the schedule by year.
The calendar for the current year serves as the home page of the application.
It works very similarly to the team member [unavailability calendar](./3.4_unavailability.md).

The heading indicates the year of the calendar.
Clicking the year to the left of the center header will show the schedule calendar for the prior year.
Clicking the year to the right of the center header will show the schedule calendar for the next year.

The calendar is organized by month, and the current date is highlighted.

Clicking on a date will bring you to the schedule week editor for the week containing that date.

## Schedule Week Editor

The schedule week editor page essentially consists of two sections.
The top portion displays the schedule editor table for editing the time slots, notes, and other information for the schedule week.
The bottom portion displays warnings about time slot assignments.

### Editor Table

![The schedule week editor table](./images/schedule_week_table.png)

#### Editor Table Tooltips

![The schedule week editor table tooltips](./images/schedule_week_table_tooltips.png)

### Schedule Warnings

![The schedule week editor warnings](./images/schedule_week_warnings.png)

## Copy Time Slots

![The time slot copy page](./images/schedule_copy.png)

The copy time slots page allows you to copy a portion of a schedule to a different date range.

### From

The "From" section includes two required fields:

* Start date - The start date of the schedule range you want to copy *from*
* End date - The end date of the schedule range you want to copy *from*

### To

The "To" section includes two required fields:

* Start date - The start date of the schedule range you want to copy *to*
* End date - The end date of the schedule range you want to copy *to*

### Options

The "Option" section contains some more advanced copy options.



### Buttons

Clicking "Preview" with valid data will preview the results of the copy operation.
If the data you enter is invalid, the form will display the errors for you to correct.
You can then attempt to correct the errors and preview again.

Clicking "Cancel" will abort the copy operation and send you back to the schedule week editor.

## Copy Time Slots Preview

![The time slot copy preview page](./images/schedule_copy_preview.png)

## Schedule Export

![The schedule export page](./images/schedule_export.png)

The schedule export page allows you to export a schedule as a spreadsheet.

The form contains four fields, all of which are required:

* Title - The title for the schedule, used for the file name
* Start date - The start date of the range to export
* End date - The end date of the range to export
* Format - The file format to use for the export

Two export formats are currently supported:

* Excel - Microsoft Excel compatible document
* CSV - Comma-separated values text file

The textual *content* of the output of each format is identical.
However, CSV does not support colors or text formatting (such as boldface).

Clicking "Export" with valid form data will download the schedule as a file in the selected format. If the data is invalid, the form will display errors you can correct.

Clicking "Cancel" will abort the export and return to the schedule editor.

### Example Excel Output

![Example Excel Output](./images/export/excel-example.png)

### Example CSV Output

![Example CSV Output](./images/export/csv.png)
