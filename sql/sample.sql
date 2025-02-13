USE schedulerApp;

-- TEAM MEMBERS
INSERT INTO teammembers 
    (firstName, middleName, lastName, birthDate, email, phone, isExternal, maxWeeklyHours, maxWeeklyDays, username, password, isAdmin) 
SELECT 'John', 'Lee', 'Stag', '2000-01-01', 'j.stag@msg.com', '7025551234', FALSE, 40, 5, 'jlun', 'pwww1!', TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM teammembers WHERE username = 'jlbeers'
);
INSERT INTO teammembers 
	(firstName, middleName, lastName, birthDate, email, phone, isExternal, maxWeeklyHours, maxWeeklyDays, username, password, isAdmin) 
	SELECT 'Alice', 'Marie', 'Doe', '1995-06-15', 'alice.doe@email.com', '3125556789', TRUE, 30, 4, 'amun', 'pww1!', FALSE
	WHERE NOT EXISTS (
		SELECT 1 FROM teammembers WHERE username = 'amun'
	);
INSERT INTO teammembers 
	(firstName, middleName, lastName, birthDate, email, phone, isExternal, maxWeeklyHours, maxWeeklyDays, username, password, isAdmin) 
	SELECT 'Michael', 'James', 'Smith', '1988-09-22', 'm.smith@email.com', '4155554321', FALSE, 45, 6, 'mjun', 'pww1!', FALSE
	WHERE NOT EXISTS (
		SELECT 1 FROM teammembers WHERE username = 'mjun'
	);
INSERT INTO teammembers 
	(firstName, middleName, lastName, birthDate, email, phone, isExternal, maxWeeklyHours, maxWeeklyDays, username, password, isAdmin)  
	SELECT 'Samantha', 'Sarah', 'Pierce', '1988-09-22', 'm.smith@email.com', '4155554321', FALSE, 45, 6, 'spun', 'pww1!', FALSE
	WHERE NOT EXISTS (
		SELECT 1 FROM teammembers WHERE username = 'spun'
	);
INSERT INTO teammembers 
	(firstName, middleName, lastName, birthDate, email, phone, isExternal, maxWeeklyHours, maxWeeklyDays, username, password, isAdmin) 
	SELECT 'Daniel', 'Joe', 'Robertson', '1998-03-1', 'd.j.r.contact@email.com', '5551231123', FALSE, 45, 6, 'djun', 'pww1!', FALSE
	WHERE NOT EXISTS (
		SELECT 1 FROM teammembers WHERE username = 'djun'
	);





-- SHIFT CONTEXTS 
INSERT INTO shiftcontexts
	(name, agegroup, location, description)
	VALUES
	("Jacobson Center, Toddlers room", "2-3", "123 N philips st", "test description")
	;
INSERT INTO shiftcontexts
	(name, agegroup, location, description)
	VALUES
	("Jacobson Center", "2-3", "123 N philips st", "test description")
	;



-- COLORS
INSERT INTO colors
	(name, hex)
	VALUES
	("yellow", "FFFF66");
INSERT INTO colors
	(name, hex)
	VALUES
	("red", "C0392B");
INSERT INTO colors
	(name, hex)
	VALUES
	("green", "58D68D");
INSERT INTO colors
	(name, hex)
	VALUES
	("blue", "1667FF");
	

-- SHIFT CONTEXT NOTES
INSERT INTO shiftcontextnotes
	(shiftcontextid, date, note, colorid)
	VALUES
	(1, "2025-03-04", "aslkdj fljsadf ljdsa ljlds jljf", 2),
	(1, "2025-03-07", "ozxiugoueru oiudaf ouda ofodsa ufoiud", 1),
	(2, "2025-03-05", "sd dsf jsdsdlkj fslkjd lkjsd lkj", 3),
	(2, "2025-03-06", "lskdj fds fsdouf 7dsf7", 1)
	;


-- TEAM MEMBER (UN) AVAILABILITY
INSERT INTO teammemberavailability
	(teamMemberId, startdatetime, enddatetime, isPreference)
	VALUES
	(1, "2025-3-4 00:00:00", "2025-3-4 23:59:59", false);
INSERT INTO teammemberavailability
	(teamMemberId, startdatetime, enddatetime, isPreference)
	VALUES
	(3, "2025-3-7 12:00:00", "2025-3-7 23:59:59", false);
INSERT INTO teammemberavailability
	(teamMemberId, startdatetime, enddatetime, isPreference)
	VALUES
	(4, "2025-3-17 00:00:00", "2025-3-23 23:59:59", false);
	
	

-- TYPICAL AVAILABILITY
		-- team member 1
INSERT INTO teammembertypicalavailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 1, "2025-3-4 08:00:00", "2025-3-4 18:00:00", true);
INSERT INTO teammembertypicalavailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 2, "2025-3-5 08:00:00", "2025-3-5 23:59:59", true);
INSERT INTO teammembertypicalavailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 3, "2025-3-6 08:00:00", "2025-3-6 23:59:59", true);
INSERT INTO teammembertypicalavailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 4, "2025-3-7 08:00:00", "2025-3-7 23:59:59", true);
INSERT INTO teammembertypicalavailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 5, "2025-3-8 08:00:00", "2025-3-8 23:59:59", true);

		-- team member 2
INSERT INTO teammembertypicalavailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(2, 1, "2025-3-4 08:00:00", "2025-3-4 18:00:00", true);
INSERT INTO teammembertypicalavailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(2, 2, "2025-3-5 08:00:00", "2025-3-5 23:59:59", true);
INSERT INTO teammembertypicalavailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(2, 3, "2025-3-6 08:00:00", "2025-3-6 23:59:59", true);
INSERT INTO teammembertypicalavailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(2, 4, "2025-3-7 08:00:00", "2025-3-7 23:59:59", true);
INSERT INTO teammembertypicalavailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(2, 5, "2025-3-8 08:00:00", "2025-3-8 23:59:59", true);
		-- team member 3
INSERT INTO teammembertypicalavailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 1, "2025-3-4 08:00:00", "2025-3-4 18:00:00", true);
INSERT INTO teammembertypicalavailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 2, "2025-3-5 08:00:00", "2025-3-5 23:59:59", true);
INSERT INTO teammembertypicalavailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 3, "2025-3-6 08:00:00", "2025-3-6 23:59:59", true);
INSERT INTO teammembertypicalavailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 4, "2025-3-7 08:00:00", "2025-3-7 23:59:59", true);
INSERT INTO teammembertypicalavailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 5, "2025-3-8 08:00:00", "2025-3-8 23:59:59", true);
		-- team member 4
INSERT INTO teammembertypicalavailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 1, "2025-3-4 08:00:00", "2025-3-4 18:00:00", true);
INSERT INTO teammembertypicalavailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 2, "2025-3-5 08:00:00", "2025-3-5 23:59:59", true);
INSERT INTO teammembertypicalavailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 3, "2025-3-6 08:00:00", "2025-3-6 23:59:59", true);
INSERT INTO teammembertypicalavailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 4, "2025-3-7 08:00:00", "2025-3-7 23:59:59", true);
INSERT INTO teammembertypicalavailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 5, "2025-3-8 08:00:00", "2025-3-8 23:59:59", true);

	INSERT INTO teammembertypicalavailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
		-- team member 5(sub)
	(1, 1, "2025-3-4 08:00:00", "2025-3-4 18:00:00", true);
INSERT INTO teammembertypicalavailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 2, "2025-3-5 08:00:00", "2025-3-5 23:59:59", true);
INSERT INTO teammembertypicalavailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 3, "2025-3-6 08:00:00", "2025-3-6 23:59:59", true);
INSERT INTO teammembertypicalavailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 4, "2025-3-7 08:00:00", "2025-3-7 23:59:59", true);
INSERT INTO teammembertypicalavailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 5, "2025-3-8 08:00:00", "2025-3-8 23:59:59", true);
INSERT INTO teammembertypicalavailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 6, "2025-3-9 08:00:00", "2025-3-9 23:59:59", true);
INSERT INTO teammembertypicalavailability
	( teamMemberId , dayOfWeek, startTime, endTime, isPreference)
	VALUES
	(1, 7, "2025-3-10 08:00:00", "2025-3-10 23:59:59", true);




-- TEAM MEMBER CONTEXT PREFERENCES
INSERT INTO teammembershiftcontextpreferences
	(teammemberid, shiftcontextid, isPreference)
	VALUES
	(1, 2, false);
INSERT INTO teammembershiftcontextpreferences
	(teammemberid, shiftcontextid, isPreference)
	VALUES
	(3, 1, false);



-- TIME SLOTS
		-- 1st team member, 1st context
INSERT INTO timeslots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(1, "2025-3-3 08:00:00", "2025-3-3, 14:00:00:00)", true, 1, "test note", 1)
	;
INSERT INTO timeslots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(1, "2025-3-4 08:00:00", "2025-3-4, 14:00:00:00)", true, 1, "test note", 1)
	;
INSERT INTO timeslots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(1, "2025-3-5 08:00:00", "2025-3-5, 14:00:00:00)", true, 1, "test note", 1)
	;
INSERT INTO timeslots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(1, "2025-3-6 08:00:00", "2025-3-6, 14:00:00:00)", true, 1, "test note", 1)
	;
INSERT INTO timeslots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(1, "2025-3-7 08:00:00", "2025-3-7, 14:00:00:00)", true, 1, "test note", 1)
	;

		-- null team member, 1st context
INSERT INTO timeslots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(1, "2025-3-3 08:00:00", "2025-3-3, 14:00:00:00)", true, null, "test note", 1)
	;
INSERT INTO timeslots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(1, "2025-3-4 08:00:00", "2025-3-4, 14:00:00:00)", true, null, "test note", 1)
	;
INSERT INTO timeslots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(1, "2025-3-5 08:00:00", "2025-3-5, 14:00:00:00)", true, null, "test note", 1)
	;
INSERT INTO timeslots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(1, "2025-3-6 08:00:00", "2025-3-6, 14:00:00:00)", true, null, "test note", 1)
	;
INSERT INTO timeslots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(1, "2025-3-7 08:00:00", "2025-3-7, 14:00:00:00)", true, null, "test note", 1)
	;
	

		-- 3rd team member, second center
INSERT INTO timeslots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(2, "2025-3-3 08:00:00", "2025-3-3, 14:00:00:00)", true, 3, "test note", 1)
	;
INSERT INTO timeslots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(2, "2025-3-4 08:00:00", "2025-3-4, 14:00:00:00)", true, 3, "test note", 1)
	;
INSERT INTO timeslots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(2, "2025-3-5 08:00:00", "2025-3-5, 14:00:00:00)", true, 3, "test note", 1)
	;
INSERT INTO timeslots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(2, "2025-3-6 08:00:00", "2025-3-6, 14:00:00:00)", true, 3, "test note", 1)
	;
INSERT INTO timeslots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(2, "2025-3-7 08:00:00", "2025-3-7, 14:00:00:00)", true, 3, "test note", 1)
	;

		-- 4th team member, second center
INSERT INTO timeslots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(2, "2025-3-3 08:00:00", "2025-3-3, 14:00:00:00)", true, 4, "test note", 1)
	;
INSERT INTO timeslots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(2, "2025-3-4 08:00:00", "2025-3-4, 14:00:00:00)", true, 4, "test note", 1)
	;
INSERT INTO timeslots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(2, "2025-3-5 08:00:00", "2025-3-5, 14:00:00:00)", true, 4, "test note", 1)
	;
INSERT INTO timeslots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(2, "2025-3-6 08:00:00", "2025-3-6, 14:00:00:00)", true, 4, "test note", 1)
	;
INSERT INTO timeslots
	(shiftcontextid, startdatetime, endDateTime, requiresadult,teammemberID,note, colorid)
	VALUES
	(2, "2025-3-7 08:00:00", "2025-3-7, 14:00:00:00)", true, 4, "test note", 1)
	;


-- SUBSTITUTES
		-- 5th team member is sub
INSERT INTO substitutes
	(teammemberid, date)
	VALUES
	(5, "2025-3-1")
	

	
