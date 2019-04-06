DROP TABLE  emp;
DROP TABLE  emp_audit;

CREATE TABLE emp(empname text NOT NULL, salary  integer);
CREATE TABLE emp_audit(empname text NOT NULL, salary integer);

CREATE OR REPLACE FUNCTION process_emp_audit()  RETURNS TRIGGER AS $emp_audit$
BEGIN
IF(TG_OP = 'DELETE') THEN
INSERT INTO emp_audit(empname, salary) values('DELETING', 100);
RETURN OLD;
ELSIF(TG_OP = 'UPDATE') THEN
INSERT INTO emp_audit(empname, salary) values('updating', 200);
RETURN NEW;
ELSIF(TG_OP = 'INSERT') THEN
INSERT INTO emp_audit(empname, salary) values('inserting', 300);
RETURN NEW;
END IF;
RETURN NULL;
END;
$emp_audit$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS emp_audit on emp;
CREATE TRIGGER emp_audit
AFTER INSERT OR UPDATE OR DELETE ON emp
FOR EACH ROW EXECUTE PROCEDURE process_emp_audit();