# Shift Contexts

A shift context is a grouping that time slots can exist in. It might be a
classroom, a location, or any category. A [time slot](6.1_time_slots.md) must
exist within exactly one shift context.

## Shift Context List

![The shift context list page](images/shift_context_list.png)

The shift context list page shows all shift contexts you have created. It also
allows you to change the order of the shift contexts.

Clicking "Add" will open a form to
[create a new shift context](#shift-context-add).

Each shift context card includes the following information and buttons:

- Shift context name
- Up arrow button (&uparrow;) - Moves the shift context up in the sort order
- Down arrow button (&downarrow;) - Moves the shift context down in the sort
  order
- Edit button (✏️) - Opens a form to edit the shift context
- Delete button ("x") - Asks to confirm the deletion of the shift context

The up arrow button (&uparrow;) will be grayed and disabled if the shift context
is already at the top of the list. The down arrow button (&downarrow;) will be
grayed and disabled if the shift context is already at the bottom of the list.

Note: The order of the shift contexts on this page dictates their order on the
schedule. This includes the
[schedule week editor](./6_schedule.md#schedule-week-editor) and
[file exports](./6_schedule.md#schedule-export).

## Shift Context Add

![The shift context add page](images/shift_context_add.png)

The add shift context page allows you to create a new shift context. The fields
include:

- Name
- Age group
- Location
- Description

Only the name is required. Every shift context must have a unique name.

Clicking "Save" with valid information will save the shift context and return
you to the [shift context list page](#shift-context-list). If the information is
invalid, the form will display errors you can correct. You can then attempt to
save again.

Clicking "Cancel" will discard the information and return you to the
[shift context list page](#shift-context-list).

## Shift Context Edit

![The shift context edit page](images/shift_context_edit.png)

The edit shift context page allows you to edit an existing shift context. It
works similarly to the [shift context add page](#shift-context-add).

Clicking "Save" with valid information will save your changes and return you to
the [shift context list page](#shift-context-list). If the information is
invalid, the form will display errors you can correct. You can then attempt to
save again.

Clicking "Cancel" will discard your changes and return you to the
[shift context list page](#shift-context-list).

## Shift Context Delete

![The shift context delete page](images/shift_context_delete.png)

The shift context delete page allows you to confirm the deletion of a shift
context.

Clicking "Yes" will delete the shift context and return you to the
[shift context list page](#shift-context-list). Clicking "No" will cancel the
deletion and return you to the [shift context list page](#shift-context-list).

Warning: If you delete a shift context, all time slots and notes associated with
it will also be deleted.
