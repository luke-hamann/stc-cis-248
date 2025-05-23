USE schedulerapp;

SET default_storage_engine=INNODB;

CREATE TABLE TeamMembers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(500) NOT NULL,
    middleName VARCHAR(500),
    lastName VARCHAR(500) NOT NULL,
    birthDate DATE NOT NULL,
    email VARCHAR(500),
    phone VARCHAR(500),
    isExternal BOOLEAN NOT NULL,
    maxWeeklyHours DOUBLE,
    maxWeeklyDays TINYINT,
    username VARCHAR(100),
    password VARCHAR(500),
    isAdmin BOOLEAN NOT NULL
);

CREATE TABLE ShiftContexts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    ageGroup VARCHAR(500),
    location VARCHAR(500),
    description VARCHAR(1000),
    sortPriority INT NOT NULL UNIQUE
);

CREATE TABLE Colors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    hex CHAR(6) NOT NULL
);

CREATE TABLE ShiftContextNotes (
    shiftContextId INT,
    date DATE,
    note VARCHAR(500) NOT NULL,
    colorId INT,
    PRIMARY KEY (shiftContextId, date),
    FOREIGN KEY (shiftContextId)
        REFERENCES ShiftContexts(id)
        ON DELETE CASCADE,
    FOREIGN KEY (colorId)
        REFERENCES Colors(id)
        ON DELETE SET NULL
);

CREATE TABLE TeamMemberAvailability (
    id INT PRIMARY KEY AUTO_INCREMENT,
    teamMemberId INT NOT NULL,
    startDateTime DATETIME NOT NULL,
    endDateTime DATETIME NOT NULL,
    isPreference BOOLEAN NOT NULL,
    FOREIGN KEY (teamMemberId)
        REFERENCES TeamMembers(id)
        ON DELETE CASCADE,
    CHECK (startDateTime < endDateTime)
);

CREATE TABLE TeamMemberTypicalAvailability (
    id INT PRIMARY KEY AUTO_INCREMENT,
    teamMemberId INT NOT NULL,
    dayOfWeek TINYINT NOT NULL,
    startTime TIME NOT NULL,
    endTime TIME NOT NULL,
    isPreference BOOLEAN NOT NULL,
    FOREIGN KEY (teamMemberId)
        REFERENCES TeamMembers(id)
        ON DELETE CASCADE,
    CHECK (startTime < endTime)
);

CREATE TABLE TeamMemberShiftContextPreferences (
    teamMemberId INT,
    shiftContextId INT,
    isPreference BOOLEAN NOT NULL,
    PRIMARY KEY (teamMemberId, shiftContextId),
    FOREIGN KEY (teamMemberId)
        REFERENCES TeamMembers(id)
        ON DELETE CASCADE,
    FOREIGN KEY (shiftContextId)
        REFERENCES ShiftContexts(id)
        ON DELETE CASCADE
);

CREATE TABLE TimeSlots (
    id INT PRIMARY KEY AUTO_INCREMENT,
    shiftContextId INT NOT NULL,
    startDateTime DATETIME NOT NULL,
    endDateTime DATETIME,
    requiresAdult BOOLEAN NOT NULL,
    teamMemberId INT,
    note VARCHAR(1000),
    colorId INT,
    FOREIGN KEY (shiftContextId)
        REFERENCES ShiftContexts(id)
        ON DELETE CASCADE,
    FOREIGN KEY (teamMemberId)
        REFERENCES TeamMembers(id)
        ON DELETE SET NULL,
    FOREIGN KEY (colorId)
        REFERENCES Colors(id)
        ON DELETE SET NULL,
    CHECK (endDateTime IS NULL OR startDateTime < endDateTime)
);

CREATE TABLE Substitutes (
    teamMemberId INT,
    date DATE,
    PRIMARY KEY (teamMemberId, date),
    FOREIGN KEY (teamMemberId)
        REFERENCES TeamMembers(id)
        ON DELETE CASCADE
);
