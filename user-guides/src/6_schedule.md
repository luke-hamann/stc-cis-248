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

The schedule editor table allows you to work with time slots, their assignees, daily shift context notes, and daily substitute lists.
By pulling together time slot assignments, preferences, availability, and other information, it also provides rich warnings and insights so your schedule is less likely to contain errors.

The center header at the top of the page states what week the schedule is for.
Clicking this header will send you to the [schedule calendar](#schedule-year-calendar) for the year the schedule week is within.

Clicking the left angle bracket (\<) to the left of the header will navigate the schedule editor to the prior week.
Clicking the right angle bracket (\>) to the right of the header will navigate the schedule editor to the next week.

The three buttons below the header have the following functions:

* Copy - Opens the [copy time slots form](#copy-time-slots) and autofills it to copy from the current schedule week.
* Clear - Opens the []

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

The "Option" section includes some more advanced copy options:

* Repeat copy
* Include assignees
* Include shift context notes
* Include time slot notes

**Repeat copy** determines whether the copied source range should be repeated to exactly file the destination range (with truncation of the source copy) if the destination range is longer than the source range.
For some examples:

* If the From range spans 2 days, and the "To" range spans 1 day, only the first day of the From range will be copied to the "To" range.
  Repeat copy will have no effect.
* If the "From" range and To range span the same number of days, the copy will be exact.
  Repeat copy will have no effect.
* Suppose the From range spans 2 days, and the To range spans 5 days.
  * If "Repeat copy" is turned off:
    * Day 1 and Day 2 of the From will be copied to Day 1 and Day 2 of the To, respectively.
    * Days 3 through 5 will be wiped blank in the To.
  * If "Repeat copy" is turned on:
    * Day 1 and Day 2 of the From will be copied to Day 1 and Day 2 of the To, respectively.
    * Day 1 and Day 2 of the From will be copied to Day 3 and Day 4 of the To, respectively.
    * Day 1 of the From will be copied to Day 5 of the To.
    * Day 2 will *not* be copied a third time because it would exceed the boundaries of the destination date range (e.g. the sixth day).

**Include assignees** determines whether the copied time slots should keep their team member assignment.
Otherwise, the copy of the time slots will be marked unassigned.

**Include shift context notes** determines whether the daily shift context notes within the source date range should be also be copied into the destination date range.
Otherwise, the destination date range will not include any daily shift context notes.

**Include time slot notes** determines whether the copied time slots should keep their notes (and colors).
Otherwise, the notes in the copied time slots are blanked out.

### Buttons

Clicking "Preview" with valid data will preview the results of the copy operation.
If the data you enter is invalid, the form will display the errors for you to correct.
You can then correct the errors and again attempt to preview the changes.

Clicking "Cancel" will abort the copy operation and send you back to the schedule week editor.

## Copy Time Slots Preview

![The time slot copy preview page](./images/schedule_copy_preview.png)

The copy preview page allows you to preview the results of the a schedule copy operation before confirming it.
The top of the form indicates the source and destination date ranges you specified as well as a warning message that data in the destination date range will be overwritten.

This warning is worth repeating.
You need to make sure the source and destination ranges are correct, especially the destination range.
**All data in the destination date range will be overwritten.**

Clicking "Confirm" will execute the copy operation and return you to the schedule week editor.

Clicking "Edit" will allow you to go back to the [copy time slots page](#copy-time-slots) and modify any copy options you specified earlier.
You can then click to preview the changes on that page to return to this page.

Clicking "Cancel" will abort the copy operation without making any changes to the schedule and return you to the schedule week editor.

Below the buttons, the page provides lists with counts of all objects that will be copied to the destination range.
This allows you to preview the time slots and shift context notes that will be created.

## Clear Schedule

![The clear schedule page](./images/schedule_clear.png)

The clear schedule page allows you to delete a certain date range of the schedule.

The fields include:

* Start date - The start date of the range you wish to delete from the schedule
* End date - The end date of the range you wish to delete from the schedule
* Delete time slots - Whether time slots should be deleted in the date range
* Delete shift context notes - Whether shift context notes within the date range should be deleted
* Delete substitutes - Whether substitute lists within the date range should be deleted

Only the start date and end date are required.
However, you must select at least one of the three object types to delete.
(Otherwise, the clear operation would have no effect.)

Clicking "Clear" with valid data will immediately delete the relevant objects from the schedule and return you to the schedule week editor.
If the data is invalid, the form will display errors you can correct, and you can attempt to clear again.

Clicking "Cancel" will abort the clear operation (without making any changes to the schedule) and return you to the schedule week editor.

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
