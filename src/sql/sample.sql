USE schedulerapp;

-- TEAM MEMBERS
INSERT INTO TeamMembers 
    (firstName, middleName, lastName, birthDate, email, phone, isExternal, maxWeeklyHours, maxWeeklyDays, username, password, isAdmin) 
SELECT 'John', 'Lee', 'Stag', '2000-01-01', 'j.stag@msg.com', '7025551234', FALSE, 40, 5, 'jlun', 'pwww1!', TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM TeamMembers WHERE username = 'jlbeers'
);
INSERT INTO TeamMembers 
	(firstName, middleName, lastName, birthDate, email, phone, isExternal, maxWeeklyHours, maxWeeklyDays, username, password, isAdmin) 
	SELECT 'Alice', 'Marie', 'Doe', '1995-06-15', 'alice.doe@email.com', '3125556789', TRUE, 30, 4, 'amun', 'pww1!', FALSE
	WHERE NOT EXISTS (
		SELECT 1 FROM TeamMembers WHERE username = 'amun'
	);
INSERT INTO TeamMembers 
	(firstName, middleName, lastName, birthDate, email, phone, isExternal, maxWeeklyHours, maxWeeklyDays, username, password, isAdmin) 
	SELECT 'Michael', 'James', 'Smith', '1988-09-22', 'm.smith@email.com', '4155554321', FALSE, 45, 6, 'mjun', 'pww1!', FALSE
	WHERE NOT EXISTS (
		SELECT 1 FROM TeamMembers WHERE username = 'mjun'
	);
INSERT INTO TeamMembers 
	(firstName, middleName, lastName, birthDate, email, phone, isExternal, maxWeeklyHours, maxWeeklyDays, username, password, isAdmin)  
	SELECT 'Samantha', 'Sarah', 'Pierce', '1988-09-22', 'm.smith@email.com', '4155554321', FALSE, 45, 6, 'spun', 'pww1!', FALSE
	WHERE NOT EXISTS (
		SELECT 1 FROM TeamMembers WHERE username = 'spun'
	);
INSERT INTO TeamMembers 
	(firstName, middleName, lastName, birthDate, email, phone, isExternal, maxWeeklyHours, maxWeeklyDays, username, password, isAdmin) 
	SELECT 'Daniel', 'Joe', 'Robertson', '1998-03-1', 'd.j.r.contact@email.com', '5551231123', FALSE, 45, 6, 'djun', 'pww1!', FALSE
	WHERE NOT EXISTS (
		SELECT 1 FROM TeamMembers WHERE username = 'djun'
	);





-- SHIFT CONTEXTS 
INSERT INTO ShiftContexts
	(name, agegroup, location, description, sortPriority)
	VALUES
	("Jacobson Center, Toddlers room", "2-3", "123 N philips st", "test description", 2)
	;
INSERT INTO ShiftContexts
	(name, agegroup, location, description, sortPriority)
	VALUES
	("Jacobson Center", "2-3", "123 N philips st", "test description", 1)
	;



-- Colors
INSERT INTO Colors
	(name, hex)
	VALUES
	("yellow", "FFFF66");
INSERT INTO Colors
	(name, hex)
	VALUES
	("red", "C0392B");
INSERT INTO Colors
	(name, hex)
	VALUES
	("green", "58D68D");
INSERT INTO Colors
	(name, hex)
	VALUES
	("blue", "1667FF");
	

-- SHIFT CONTEXT NOTES
INSERT INTO ShiftContextNotes
	(shiftcontextid, date, note, colorid)
	VALUES
	(1, "2025-03-04", "aslkdj fljsadf ljdsa ljlds jljf", 2),
	(1, "2025-03-07", "ozxiugoueru oiudaf ouda ofodsa ufoiud", 1),
	(2, "2025-03-05", "sd dsf jsdsdlkj fslkjd lkjsd lkj", 3),
	(2, "2025-03-06", "lskdj fds fsdouf 7dsf7", 1)
	;


-- TEAM MEMBER (UN) AVAILABILITY
INSERT INTO TeamMemberAvailability
	(teamMemberId, startdatetime, enddatetime, isPreference)
	VALUES
	(1, "2025-03-04 00:00:00", "2025-03-04 23:59:59", false);
INSERT INTO TeamMemberAvailability
	(teamMemberId, startdatetime, enddatetime, isPreference)
	VALUES
	(3, "2025-03-07 12:00:00", "2025-03-07 23:59:59", false);
INSERT INTO TeamMemberAvailability
	(teamMemberId, startdatetime, enddatetime, isPreference)
	VALUES
	(4, "2025-03-17 00:00:00", "2025-03-23 23:59:59", false);
	
	

-- TYPICAL AVAILABILITY
		-- team member 1
INSERT INTO TeamMemberTypicalAvailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 1, "2025-03-04 08:00:00", "2025-03-04 18:00:00", true);
INSERT INTO TeamMemberTypicalAvailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 2, "2025-03-05 08:00:00", "2025-03-05 23:59:59", true);
INSERT INTO TeamMemberTypicalAvailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 3, "2025-03-06 08:00:00", "2025-03-06 23:59:59", true);
INSERT INTO TeamMemberTypicalAvailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 4, "2025-03-07 08:00:00", "2025-03-07 23:59:59", true);
INSERT INTO TeamMemberTypicalAvailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 5, "2025-03-08 08:00:00", "2025-03-08 23:59:59", true);

		-- team member 2
INSERT INTO TeamMemberTypicalAvailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(2, 1, "2025-03-04 08:00:00", "2025-03-04 18:00:00", true);
INSERT INTO TeamMemberTypicalAvailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(2, 2, "2025-03-05 08:00:00", "2025-03-05 23:59:59", true);
INSERT INTO TeamMemberTypicalAvailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(2, 3, "2025-03-06 08:00:00", "2025-03-06 23:59:59", true);
INSERT INTO TeamMemberTypicalAvailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(2, 4, "2025-03-07 08:00:00", "2025-03-07 23:59:59", true);
INSERT INTO TeamMemberTypicalAvailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(2, 5, "2025-03-08 08:00:00", "2025-03-08 23:59:59", true);
		-- team member 3
INSERT INTO TeamMemberTypicalAvailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 1, "2025-03-04 08:00:00", "2025-03-04 18:00:00", true);
INSERT INTO TeamMemberTypicalAvailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 2, "2025-03-05 08:00:00", "2025-03-05 23:59:59", true);
INSERT INTO TeamMemberTypicalAvailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 3, "2025-03-06 08:00:00", "2025-03-06 23:59:59", true);
INSERT INTO TeamMemberTypicalAvailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 4, "2025-03-07 08:00:00", "2025-03-07 23:59:59", true);
INSERT INTO TeamMemberTypicalAvailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 5, "2025-03-08 08:00:00", "2025-03-08 23:59:59", true);
		-- team member 4
INSERT INTO TeamMemberTypicalAvailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 1, "2025-03-04 08:00:00", "2025-03-04 18:00:00", true);
INSERT INTO TeamMemberTypicalAvailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 2, "2025-03-05 08:00:00", "2025-03-05 23:59:59", true);
INSERT INTO TeamMemberTypicalAvailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 3, "2025-03-06 08:00:00", "2025-03-06 23:59:59", true);
INSERT INTO TeamMemberTypicalAvailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 4, "2025-03-07 08:00:00", "2025-03-07 23:59:59", true);
INSERT INTO TeamMemberTypicalAvailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 5, "2025-03-08 08:00:00", "2025-03-08 23:59:59", true);

	INSERT INTO TeamMemberTypicalAvailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
		-- team member 5(sub)
	(1, 1, "2025-03-04 08:00:00", "2025-03-04 18:00:00", true);
INSERT INTO TeamMemberTypicalAvailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 2, "2025-03-05 08:00:00", "2025-03-05 23:59:59", true);
INSERT INTO TeamMemberTypicalAvailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 3, "2025-03-06 08:00:00", "2025-03-06 23:59:59", true);
INSERT INTO TeamMemberTypicalAvailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 4, "2025-03-07 08:00:00", "2025-03-07 23:59:59", true);
INSERT INTO TeamMemberTypicalAvailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 5, "2025-03-08 08:00:00", "2025-03-08 23:59:59", true);
INSERT INTO TeamMemberTypicalAvailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 6, "2025-03-09 08:00:00", "2025-03-09 23:59:59", true);


INSERT INTO TeamMemberTypicalAvailability
	(teamMemberId, dayOfWeek, startTime, endTime, isPreference)
VALUES
	-- John Stag
	(1, 1, "06:00", "18:00", TRUE),
	(1, 2, "06:00", "18:00", TRUE),
	(1, 3, "06:00", "18:00", TRUE),
	(1, 4, "06:00", "18:00", TRUE),
	(1, 5, "06:00", "18:00", TRUE),

	-- Michael Smith
	(3, 1, "06:00", "18:00", TRUE),
	(3, 2, "06:00", "18:00", TRUE),
	(3, 3, "06:00", "18:00", TRUE),
	(3, 4, "06:00", "18:00", TRUE),
	(3, 5, "06:00", "18:00", TRUE),

	-- Samantha Pierce
	(4, 1, "06:00", "18:00", TRUE),
	(4, 2, "06:00", "18:00", TRUE),
	(4, 3, "06:00", "18:00", TRUE),
	(4, 4, "06:00", "18:00", TRUE),
	(4, 5, "06:00", "18:00", TRUE);


-- TEAM MEMBER CONTEXT PREFERENCES
INSERT INTO TeamMemberShiftContextPreferences
	(teammemberid, shiftcontextid, isPreference)
	VALUES
	(1, 2, false);
INSERT INTO TeamMemberShiftContextPreferences
	(teammemberid, shiftcontextid, isPreference)
	VALUES
	(3, 1, false);



-- TIME SLOTS
		-- 1st team member, 1st context
INSERT INTO TimeSlots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(1, "2025-03-03 08:00:00", "2025-03-03 14:00:00", true, 1, "test note", 1)
	;
INSERT INTO TimeSlots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(1, "2025-03-04 08:00:00", "2025-03-04 14:00:00", true, 1, "test note", 1)
	;
INSERT INTO TimeSlots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(1, "2025-03-05 08:00:00", "2025-03-05 14:00:00", true, 1, "test note", 1)
	;
INSERT INTO TimeSlots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(1, "2025-03-06 08:00:00", "2025-03-06 14:00:00", true, 1, "test note", 1)
	;
INSERT INTO TimeSlots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(1, "2025-03-07 08:00:00", "2025-03-07 14:00:00", true, 1, "test note", 1)
	;

		-- null team member, 1st context
INSERT INTO TimeSlots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(1, "2025-03-03 08:00:00", "2025-03-03 14:00:00", true, null, "test note", 1)
	;
INSERT INTO TimeSlots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(1, "2025-03-04 08:00:00", "2025-03-04 14:00:00", true, null, "test note", 1)
	;
INSERT INTO TimeSlots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(1, "2025-03-05 08:00:00", "2025-03-05 14:00:00", true, null, "test note", 1)
	;
INSERT INTO TimeSlots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(1, "2025-03-06 08:00:00", "2025-03-06 14:00:00", true, null, "test note", 1)
	;
INSERT INTO TimeSlots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(1, "2025-03-07 08:00:00", "2025-03-07 14:00:00", true, null, "test note", 1)
	;
	

		-- 3rd team member, second center
INSERT INTO TimeSlots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(2, "2025-03-03 08:00:00", "2025-03-03 14:00:00", true, 3, "test note", 1)
	;
INSERT INTO TimeSlots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(2, "2025-03-04 08:00:00", "2025-03-04 14:00:00", true, 3, "test note", 1)
	;
INSERT INTO TimeSlots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(2, "2025-03-05 08:00:00", "2025-03-05 14:00:00", true, 3, "test note", 1)
	;
INSERT INTO TimeSlots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(2, "2025-03-06 08:00:00", "2025-03-06 14:00:00", true, 3, "test note", 1)
	;
INSERT INTO TimeSlots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(2, "2025-03-07 08:00:00", "2025-03-07 14:00:00", true, 3, "test note", 1)
	;

		-- 4th team member, second center
INSERT INTO TimeSlots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(2, "2025-03-03 08:00:00", "2025-03-03 14:00:00", true, 4, "test note", 1)
	;
INSERT INTO TimeSlots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(2, "2025-03-04 08:00:00", "2025-03-04 14:00:00", true, 4, "test note", 1)
	;
INSERT INTO TimeSlots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(2, "2025-03-05 08:00:00", "2025-03-05 14:00:00", true, 4, "test note", 1)
	;
INSERT INTO TimeSlots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(2, "2025-03-06 08:00:00", "2025-03-06 14:00:00", true, 4, "test note", 1)
	;
INSERT INTO TimeSlots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(2, "2025-03-07 08:00:00", "2025-03-07 14:00:00", true, 4, "test note", 1)
	;


-- SUBSTITUTES
		-- 5th team member is sub
INSERT INTO Substitutes
	(teammemberid, date)
	VALUES
	(5, "2025-03-01")
	

	
