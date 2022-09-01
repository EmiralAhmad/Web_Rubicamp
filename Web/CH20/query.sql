CREATE TABLE data(id INTEGER PRIMARY KEY NOT NULL, string TEXT NOT NULL, integerinput INTEGER NOT NULL, floatinput DECIMAL NOT NULL, dateinput DATE NOT NULL, booleaninput  BOOLEAN NOT NULL)
insert into data values (1, 'Bang Zakka', 24, 0.123, 1000-01-01, true);
UPDATE data SET string = 'Abaz', integerinput = 555, floatinput = 55.55, dateinput = '2010-10-10', booleaninput = false where id = 2;