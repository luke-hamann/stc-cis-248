# Schedule

## Schedule Year Calendar

![The schedule year calendar](./images/schedule_year.png)

The schedule year calendar allows you to navigate through the schedule by year.
The calendar for the current year serves as the home page of the application. It
works very similarly to the team member
[unavailability calendar](./3.4_unavailability.md).

The heading indicates the year of the calendar. Clicking the year to the left of
the center year will show the schedule calendar for the previous year. Clicking
the year to the right of the center year will show the schedule calendar for the
next year.

The calendar is arranged by month. The current date is also highlighted.

Clicking on a date will bring you to the schedule week editor for the week
containing that date.

## Schedule Week Editor

The schedule week editor page consists of two sections:

1. The top portion displays the schedule editor table for working with the time
   slots, notes, substitutes, and other information for the schedule week.
2. The bottom portion displays warnings about time slot assignments.

### Editor Table

![The schedule week editor table](./images/schedule_week_table.png)

The schedule editor table allows you to work with time slots, their assignees,
daily shift context notes, and daily substitute lists. By pulling together time
slot assignments, preferences, availability, and other information, it also
provides rich warnings so your schedule is less likely to contain errors.

#### Schedule Header

The center header at the top of the page indicates what week the schedule is
for. Clicking this header will bring you to the
[schedule calendar](#schedule-year-calendar) for the year of the first day of
the schedule week.

Clicking the left angle bracket (\<) to the left of the header will navigate the
schedule editor to the previous week. Clicking the right angle bracket (\>) to
the right of the header will navigate the schedule editor to the next week.

The three buttons below the header have the following functions:

- Copy - Opens the [copy time slots form](#copy-time-slots) and auto-fills it to
  copy from the current schedule week
- Clear - Opens the [clear schedule form](#clear-schedule) and auto-fills it to
  clear the current schedule week
- Export - Opens the [export schedule form](#schedule-export) and auto-fills it
  to export the current schedule week

#### Column Headers

The first row of the table always includes the following elements:

- The first cell contains an "Add time slot" button. Clicking this will open the
  [add time slot form](./6.1_time_slots.md#time-slot-add).
- The rest of the cells in the row are column headers with the date of all time
  slots within their respective columns.

Within the date header columns, the buttons perform the following functions:

- Copy - Opens the [copy time slot form](#copy-time-slots) and auto-fills it to
  copy from the date of the column
- Clear - Opens the [clear schedule form](#clear-schedule) and auto-fills it to
  clear the contents of the column

#### Shift Contexts and Time Slots

The set of rows in the center section of the table (other than the first and
last row) is the primary place you will work to manipulate time slots and notes.

The rows are grouped by shift context and ordered by the shift context sort
priority specified on the
[shift context list page](4_shift_contexts.md#shift-context-list). They are then
ordered by "time slot group."

The cell at the intersection of a shift context row and a date column represents
a note for that shift context on the date. Clicking the "Edit" button will open
the [shift context note edit form](./6.2_shift_context_notes.md) and allow you
to edit or delete this note.

A "time slot group" row represents an artificial grouping by time slots. It
belongs to the nearest shift context that appears _above_ the row in the table.
Each time slot group represents a unique combination of four time slot
characteristics:

- Shift context
- Start time
- End time
- Age requirement (whether an adult is required)

The same time slot group may take up multiple rows in the schedule editor table
if a date within the week has 2 or more time slots that share these 4
characteristics.

The intersection of a time slot group row and a date column represents a time
slot (or a time slot possibility) with the given shift context, date, start
time, end time, and age requirement. If this cell contains a "New" button, there
is no time slot with these exact characteristics in the slot. Clicking this
button will open the [add time slot form](./6.1_time_slots.md#time-slot-add) and
auto-fill it with the shift context, date, start time, end time, and age
requirement of the group.

If you wish to create a time slot, but a group with the appropriate
characteristics does not exist in the table, clicking the "Add time slot" button
in the top left cell will open the
[time slot add form](./6.1_time_slots.md#time-slot-add) and allow you to create
a time slot using arbitrary parameters.

Otherwise, if the cell is not a "New" button, the cell represents a time slot.
It includes:

- **Assignee** - The assignee names the team member that is assigned to the time
  slot. It will be marked as "unassigned" if the time slot has not been
  assigned.
- **Warnings** - A warning icon (⚠️) will appear next to the time slot assignee
  if the time slot has warnings. Hovering over this icon will display a tooltip
  with warnings relevant to the time slot. The warnings include all warning
  types included in the [schedule warnings section](#schedule-warnings), except
  max weekly days and max weekly hours violations. (These warning types are not
  specific to individual time slots.) Team member links and time slot links
  within the tooltip work identically to those in the
  [schedule warnings section](#schedule-warnings). (Team member links navigate
  to the team member's profile. Time slot links will bold and jump to the
  referenced time slot in the editor.)
- **Time slot note** - If the time slot has a note, it will be displayed.
- **Edit button** - Clicking this will open the
  [time slot edit form](./6.1_time_slots.md#time-slot-edit) and allow you to
  edit the time slot.
- **Delete button** - Clicking this will open the
  [time slot delete form](./6.1_time_slots.md#time-slot-delete) to confirm the
  deletion of the time slot.

This is an example of a time slot cell after clicking a link to it and hovering
over its warning icon:

![The schedule week editor table tooltips](./images/schedule_week_table_tooltips.png)

#### Substitute Lists

The last row of the table contains the substitute lists for each day of the
week. The left-most cell ("Substitutes") is a static header cell. The rest of
the cells in the row (within the date columns) list the substitutes on each
date. Clicking "Edit" in any of these cells will open the
[substitutes edit form](./6.3_substitutes.md) and allow you to change the
substitutes on that date.

### Schedule Warnings

![The schedule week editor warnings](./images/schedule_week_warnings.png)

The schedule warnings section summarizes all schedule warnings regarding time
slots and assignments during the current schedule week. It appears below the
schedule week editor table.

If there are no warnings, this section will read "(none)" under the header.
Otherwise, the total number of warnings will be tallied next to the Warnings
header, and the warnings will be listed by category.

Each warnings category will be marked with a header and the number of warnings
in the category. Clicking this header will allow you to toggle between expanding
and collapsing the warning list within that category.

8 warning types are currently supported:

- **Externality** - A team member marked as an external resource has been
  assigned to a time slot.
- **Bilocation** - A team member has been assigned to two or more concurrent
  time slots (e.g. two places at the same time).
- **Adult Only Violations** - A minor has been assigned to a time slot that is
  marked as adult-only.
- **Shift Context Preference Violations** - A team member has been assigned to a
  time slot within a shift context they dislike.
- **Availability Violations** - A team member has been scheduled at a time they
  are not typically available, or they have been explicitly marked as
  unavailable.
- **Max Weekly Days Violations** - The team member has been scheduled for more
  days during the week than the maximum specified in their
  [profile](./3.1_profile.md).
- **Max Weekly Hours Violations** - The team member has been scheduled for more
  hours during the week than the maximum specified in their
  [profile](./3.1_profile.md).
- **Unassigned Time Slots** - A time slot does not have an assignee.

If the schedule for the current week does not cause any warnings in a given
category, the category will be omitted from the warnings section.

Warning messages may also contain links:

- Team member link (a full name) - Navigates to the team member's profile
- Time slot link (a date and time) - Scrolls to the time slot and bolds its cell
  border in the schedule week editor table

## Copy Time Slots

![The time slot copy page](./images/schedule_copy.png)

The copy time slots page allows you to copy a portion of a schedule to a
different date range.

### From

The "From" section includes two required fields:

- Start date - The start date of the schedule range you want to copy _from_
- End date - The end date of the schedule range you want to copy _from_

### To

The "To" section includes two required fields:

- Start date - The start date of the schedule range you want to copy _to_
- End date - The end date of the schedule range you want to copy _to_

### Options

The "Options" section includes some more advanced copy options. Only "Repeat
copy" is on by default.

- Repeat copy
- Include assignees
- Include shift context notes
- Include time slot notes

**Repeat copy** determines whether the copied source range should be repeated to
exactly fill the destination range (with truncation of the source copy) if the
destination range is longer than the source range. For example:

- If the "From" range spans 2 days, and the "To" range spans 1 day, only the
  first day of the "From" range will be copied to the "To" range. "Repeat copy"
  will have no effect.
- If the "From" range and "To" range span the same number of days, the copy will
  be exact. "Repeat copy" will have no effect.
- Suppose the "From" range spans 2 days, and the "To" range spans 5 days.
  - If "Repeat copy" is turned off:
    - Days 1 and 2 of the "From" will be copied to Days 1 and 2 of the "To,"
      respectively.
    - Days 3 through 5 will be wiped blank in the "To."
  - If "Repeat copy" is turned on:
    - Days 1 and 2 of the "From" will be copied to Days 1 and 2 of the "To,"
      respectively.
    - Days 1 and 2 of the "From" will be copied to Days 3 and 4 of the "To,"
      respectively.
    - Day 1 of the "From" will be copied to Day 5 of the "To."
    - Day 2 of the "From" will _not_ be copied a third time. The source copy is
      truncated because it would otherwise exceed the boundaries of the
      destination date range (e.g. the sixth day).

**Include assignees** determines whether the copied time slots should include
the original assignee. If disabled, the copy of the time slots will be marked
unassigned.

**Include shift context notes** determines whether the daily shift context notes
within the source date range should be copied into the destination date range.
If disabled, the destination date range will not include any daily shift context
notes.

**Include time slot notes** determines whether the copied time slots should keep
their notes (and note colors). If disabled, the notes in the copied time slots
will be blanked out.

### Buttons

Clicking "Preview" with valid information will display the
[copy operation preview](#copy-time-slots-preview). If the information is
invalid, the form will display the errors for you to correct. You can then
attempt to preview the changes again.

Clicking "Cancel" will abort the copy operation and return you to the
[schedule week editor](#schedule-week-editor).

## Copy Time Slots Preview

![The time slot copy preview page](./images/schedule_copy_preview.png)

The copy preview page allows you to preview the results of a schedule copy
operation before confirming it. The top of the form indicates the specified
source and destination date ranges as well as a warning message that data in the
destination date range will be overwritten.

This warning is worth repeating. You need to make sure the source and
destination ranges are correct, especially the destination range. **All data in
the destination date range will be overwritten.**

Clicking "Confirm" will execute the copy operation and return you to the
[schedule week editor](#schedule-week-editor).

Clicking "Edit" will allow you to go back to the
[copy time slots page](#copy-time-slots) and modify any copy options you
specified earlier. You can then click to preview the changes again to return to
this page.

Clicking "Cancel" will abort the copy operation without making any changes to
the schedule. It will return you to the
[schedule week editor](#schedule-week-editor).

Below the buttons, the page provides lists with counts of all objects that will
be copied to the destination range. This allows you to preview the time slots
and shift context notes that will be created.

## Clear Schedule

![The clear schedule page](./images/schedule_clear.png)

The clear schedule page allows you to delete a date range of the schedule.

The fields include:

- Start date - The start of the range to delete from the schedule
- End date - The end of the range to delete from the schedule
- Delete time slots - Whether time slots within the date range should be deleted
- Delete shift context notes - Whether shift context notes within the date range
  should be deleted
- Delete substitutes - Whether substitute lists within the date range should be
  deleted

Only the start date and end date are required. By default, none of the deletion
option checkboxes are checked. However, you must select at least one of the
three object types to delete. (Otherwise, the clear operation would have no
effect.)

Clicking "Clear" with valid information will delete the selected objects within
the date range on the schedule and return you to the
[schedule week editor](#schedule-week-editor). If the information is invalid,
the form will display errors you can correct, and you can attempt to clear
again.

Clicking "Cancel" will abort the clear operation without making any changes to
the schedule and return you to the
[schedule week editor](#schedule-week-editor).

## Schedule Export

![The schedule export page](./images/schedule_export.png)

The schedule export page allows you to export a schedule as a spreadsheet.

The form contains four fields, all of which are required:

- Title - The title for the schedule export, used for the file name
- Start date - The start date of the range to export
- End date - The end date of the range to export
- Format - The file format to use for the export

Two export formats are currently supported:

- Excel - Microsoft Excel compatible document
- CSV - Comma-separated values text file

The textual _content_ of the output for each format is identical. However, CSV
does not support colors or text formatting (such as boldface).

Clicking "Export" with valid information will download the schedule as a file in
the selected format. If the information is invalid, the form will display errors
you can correct, and you can attempt to export again.

Clicking "Cancel" will abort the export and return to the
[schedule week editor](#schedule-week-editor).

### Example Excel Output

![Example Excel Output](./images/export/excel-example.png)

### Example CSV Output

![Example CSV Output](./images/export/csv.png)
