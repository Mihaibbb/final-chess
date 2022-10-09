const Organisation = require("../models/organisationModel");
const ErrorResponse = require("../handlers/error");
const axios = require("axios");
const db = require("../db");
const generateId = require("../functions/generateId");

exports.createAppointment = async (req, res, next) => {
    const { _id, startDate, endDate, users, patients, title, income, typeIncome, notes, date, language } = req.body;
    console.log( new Date(startDate).getMonth(), new Date(startDate).getDate(), new Date(startDate).getHours(), new Date(startDate).getMinutes());
    
    try {
        const appointmentId = generateId(25);
        sql = "INSERT INTO ?? (_id, startDate, endDate, users, patients, title, income, typeIncome, notes, finished, date, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const insertedAppointment = await db.query(sql, [`${process.env.DB_PREFIX}org_${_id}.schedules`, appointmentId, new Date(startDate), new Date(endDate), JSON.stringify(users), JSON.stringify(patients), title, income, typeIncome, notes, false, new Date(date), new Date()]);
        if (!insertedAppointment) return new ErrorResponse("An error occured!", 404);
        
        // Sms Api for patient

        // 1 day earlier message

        let patientsPhones = "";
        console.log(patients);
        patients.forEach((currPatient, idx) => idx !== patients.length - 1 ? patientsPhones += `${currPatient.phone},` : patientsPhones += currPatient.phone);

        let data = JSON.stringify({
            phone: patientsPhones,
            shortTextMessage: `Buna ziua! Clinica Zen Tec va asteapta maine la ora ${new Date(startDate).getHours()}:${new Date(startDate).getMinutes()}.`,
            startDate: new Date(startDate).getTime() - (1000 * 60 * 60 * 24),
            endDate: new Date(startDate).getTime() - (1000 * 60 * 60 * 24) + (1000 * 60 * 3)
        });

        let config = {
            method: 'post',
            url: process.env.SMS_URL,
            headers: {
                Authorization: process.env.SMS_API,
                'Content-Type': 'application/json',
            },
            data: data
        };
        
        try {
            const response = await axios(config);
            if (!response) console.log("Error sending scheduled SMS.");
            else console.log("SEND!", response);
        } catch (e) {
            console.log("Error: ", e);
        }

        // 1 hour earlier message
        console.log(new Date(startDate))

        data = JSON.stringify({
            phone: patientsPhones,
            shortTextMessage: language === "ro" ? `Buna ziua! Clinica Zen Tec va asteapta astazi la ora ${new Date(startDate).getHours()}:${new Date(startDate).getMinutes()}.` : ``,
            startDate: new Date(startDate).getTime() - (1000 * 60 * 60) - (1000 * 60 * 3),
            endDate: new Date(startDate).getTime() - (1000 * 60 * 60),
        });

        config = {
            method: 'post',
            url: process.env.SMS_URL,
            headers: {
                Authorization: process.env.SMS_API,
                'Content-Type': 'application/json',
            },
            data: data
        };

        try {
            const response = await axios(config);
            if (!response) console.log("Error sending scheduled SMS.");
            else console.log(response.data)
        } catch (e) {
            console.log("Error: ", e);
        }

        // Push to patient's historic

        patients.forEach(currPatient => {
            (async () => {
                sql = "SELECT * FROM ?? WHERE _id = ?";
                const patientArr = await db.query(sql, [`${process.env.DB_PREFIX}org_${_id}.patients`, currPatient._id]);
                const patient = await patientArr[0];
                console.log(patient);
                const historic = JSON.stringify([...JSON.parse(await patient.historic), {
                    startHour: new Date(startDate).getHours(),
                    startMinutes: new Date(startDate).getMinutes(),
                    endHour: new Date(endDate).getHours(),
                    endMinutes: new Date(endDate).getMinutes(),
                    date: new Date(startDate),
                    price: income,
                    typePrice: typeIncome,
                    title: title
                }]);
        
                sql = "UPDATE ?? SET historic = ? WHERE _id = ?";
                await db.query(sql, [`${process.env.DB_PREFIX}org_${_id}.patients`, historic, currPatient._id]);    
            })();
        });

        res.status(200).json({ success: true, message: { en: "Appointment added successfully!", ro: "Programare adaugata cu succes!" } });
        
    } catch (e) {
        console.log(e);
        
        res.status(404).json({ success: false, message: "An error occured!" });
    }

};

exports.updateAppointment = async (req, res, next) => {
    const { appointmentId, _id, startDate, endDate, users, patients, title, income, typeIncome, notes, date, finished } = req.body;
    
    try {
        let sql = 'UPDATE ?? SET startDate = ?, endDate = ?, users = ?, patients = ?, title = ?, income = ?, typeIncome = ?, notes = ?, date = ?, finished = ? WHERE _id = ?';
        const updatedAppointment = await db.query(sql, [`${process.env.DB_PREFIX}org_${_id}.schedules`, new Date(startDate), new Date(endDate), JSON.stringify(users), JSON.stringify(patients), title, income, typeIncome, notes, date, finished, appointmentId]);
       
        if (!updatedAppointment) return res.status(200).json({ success: false, message: { en: "Appointment could not be updated!", ro: "Programarea nu a putut fi modificata!" } })
        
        res.status(200).json({ success: true, message: { en: "Appointment updated successfully!", ro: "Programare modificata cu succes!"}})
    } catch (e) {
        res.status(404).json({ success: false, message: "An error occured." });
    }
};

exports.removeAppointment = async (req, res, next) => {
    const { _id, appointmentId } = req.body;
    try {
        let sql = "DELETE FROM ?? WHERE _id = ?";
        const deletedAppointment = await db.query(sql, [`${process.env.DB_PREFIX}org_${_id}.schedules`, appointmentId]);
        if (!deletedAppointment) return new ErrorResponse("An error occured!", 404);
        
        res.status(200).json({ success: true, message: { en: "Appointment removed successfully!", ro: "Programare stearsa cu succes!"}});
        
    } catch (e) {
        res.status(404).json({ success: false, message: "An error occured." });
    }
};

exports.nextAppointments = async (req, res, next) => {
    const { _id } = req.body;
    try {
        let sql = "SELECT * FROM ?? WHERE startDate >= ? ORDER BY startDate ASC";
        const nextAppointments = await db.query(sql, [`${process.env.DB_PREFIX}org_${_id}.schedules`, new Date()]);

        res.status(200).json({ success: true, appointments: await nextAppointments })
    } catch (e) {
        console.log(e);
        res.status(404).json({ success: false, message: "An error occured!" });
    }
};

exports.analytics = async (req, res, next) => {
    const { filter, _id } = req.body;
    console.log(filter);
    try {
        
        sql = "SELECT * FROM ??";
        const patientsDb = await db.query(sql, [`${process.env.DB_PREFIX}org_${_id}.patients`]);
        const schedulesDb = await db.query(sql, [`${process.env.DB_PREFIX}org_${_id}.schedules`]);
        
        // Schedules made
    
        if (filter === "day") {
            const patients = await patientsDb.filter(patient => new Date(patient.date).getFullYear() === new Date().getFullYear() &&
                                                                     new Date(patient.date).getMonth() === new Date().getMonth() &&
                                                                     new Date(patient.date).getDate() === new Date().getDate());
    
            const appointments = await schedulesDb.filter(schedule => new Date(schedule.createdAt).getFullYear() === new Date().getFullYear() &&
                                                                           new Date(schedule.createdAt).getMonth() === new Date().getMonth() &&
                                                                           new Date(schedule.createdAt).getDate() === new Date().getDate());
            let totalIncome = 0;
            await appointments.forEach(appointment => totalIncome += appointment.income); 
    
            res.status(200).json({ success: true, patients: await patients.length, appointments: await appointments.length, income: totalIncome, typeIncome: await appointments.length > 0 && await appointments[0].typeIncome ? await appointments[0].typeIncome : "LEI" });
        
        } else if (filter === "month") {
      
            const patients = await patientsDb.filter(patient => new Date(patient.date).getFullYear() === new Date().getFullYear() &&
                                                                     new Date(patient.date).getMonth() === new Date().getMonth());

            const appointments = await schedulesDb.filter(schedule => new Date(schedule.createdAt).getFullYear() === new Date().getFullYear() &&
                                                                           new Date(schedule.createdAt).getMonth() === new Date().getMonth());
            let totalIncome = 0;
            await appointments.forEach(appointment => totalIncome += appointment.income); 
            
            console.log(patients, appointments, totalIncome);
            res.status(200).json({ success: true, patients: await patients.length, appointments: await appointments.length, income: totalIncome, typeIncome: await appointments.length > 0 && await appointments[0].typeIncome ? await appointments[0].typeIncome : "LEI"});
            
        }
        else if (filter === "year") {
            const patients = await patientsDb.filter(patient => new Date(patient.date).getFullYear() === new Date().getFullYear());
    
            const appointments = await schedulesDb.schedules.filter(schedule => new Date(schedule.createdAt).getFullYear() === new Date().getFullYear());
            let totalIncome = 0;
            await appointments.forEach(appointment => totalIncome += appointment.income); 
    
            res.status(200).json({ success: true, patients: await patients.length, appointments: await appointments.length, income: totalIncome, typeIncome: await appointments.length > 0 && await appointments[0].typeIncome ? await appointments[0].typeIncome : "LEI" });
        }

    } catch (e) {
        console.log(e);
        res.status(404).json({ success: false, message: "An error occured." });
    }
    
};  

exports.checkPatient = async (req, res, next) => {
    const { organisationId, patientId } = req.body;
    try {
        let sql = "SELECT * FROM ?? WHERE _id = ?";
        const patient = await db.query(sql, [`${process.env.DB_PREFIX}org_${organisationId}.patients`, patientId]);
        if (!patient) return res.status(200).json({ success: false });
        res.status(200).json({ success: true });
    } catch (e) {
        console.log(e);
        res.status(404).json({ success: false });
    }
};

exports.createPatient = async (req, res, next) => {
    const { _id, firstname, username, lastname, email, phone, birthdate, cnp, gender, address, doctors, fileNumber, notes, city, county } = req.body;
    try {
        console.log("phone number", phone);
    

        if (email && email.length > 0) {
            const emailValidation = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!email.match(emailValidation)) {
                res.status(200).json({ success: false, message: { en: "Please enter a valid email!", ro: "Va rugam introduceti un email valid!" } });
                return;
            }
        }

        const phoneNumberValidation = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        const phoneNumberSecondValidation = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g;

        if (!phone.match(phoneNumberValidation) && !phone.match(phoneNumberSecondValidation)) {
            res.status(200).json({ success: false, message: { en: "Please enter a valid phone number!", ro: "Va rugam introduceti un numar de telefon valid!" } });
            return;
        } 

        // Verifying if unique username / email / phone number

        sql = "SELECT * FROM ?? WHERE phone = ?";
        const phoneUsed = await db.query(sql, [`${process.env.DB_PREFIX}org_${_id}.patients`, phone]);

        console.log(phoneUsed);
        if (phoneUsed && phoneUsed.length > 0) return res.status(200).json({ success: false, message: { en: "Phone number is already used!", ro: "Numarul de telefon este deja inregistrat!" } });
        
        if (email && email.length > 0) {
            sql = "SELECT * FROM ?? WHERE email = ?";
            const emailUsed = await db.query(sql, [`${process.env.DB_PREFIX}org_${_id}.patients`, email]);

            if (emailUsed && emailUsed.length > 0) return res.status(200).json({ success: false, message: { en: "Email is already used!", ro: "Email-ul este deja folosit!" } });
        }

        if (username && username.length > 0) {
            sql = "SELECT * FROM ?? WHERE username = ?";
            const usernameUsed = await db.query(sql, [`${process.env.DB_PREFIX}org_${_id}.patients`, username]);
            console.log(usernameUsed);
            if (usernameUsed && usernameUsed.length > 0) return res.status(200).json({ success: false, message: { en: "Username is already taken!", ro: "Username-ul este deja inregistrat!" } });
        }

        if (cnp && cnp.length > 0) {
            sql = "SELECT * FROM ?? WHERE cnp = ?";
            const cnpUsed = await db.query(sql, [`${process.env.DB_PREFIX}org_${_id}.patients`, cnp]);
            if (cnpUsed && cnpUsed.length > 0) return res.status(200).json({ success: false, message: {en: "PIC is already used!", ro: "CNP-ul este deja inregistrat!"} });
        }

        if (fileNumber && fileNumber.length > 0) {
            sql = "SELECT * FROM ?? WHERE fileNumber = ?";
            const fileNumberUsed = await db.query(sql, [`${process.env.DB_PREFIX}org_${_id}.patients`, fileNumber]);
            if (fileNumberUsed && fileNumberUsed.length > 0) return res.status(200).json({ success: false, message: {en: "File number is already used!", ro: "Numarul de fisa este deja inregistrat!"} });
        }

        const patientId = generateId(25);

        sql = "INSERT INTO ?? (_id, firstname, lastname, username, email, phone, birthdate, cnp, gender, city, county, address, doctors, date, notes, fileNumber, historic, profileImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const params = [`${process.env.DB_PREFIX}org_${_id}.patients`, patientId, firstname, lastname, username, email, phone, birthdate, cnp, gender, city, county, address, JSON.stringify(doctors), new Date(), notes, fileNumber, JSON.stringify([]), JSON.stringify([])];
        const insertedPatient = await db.query(sql, params);
        if (!insertedPatient) return new ErrorResponse("An error occured!", 404);
        
        res.status(200).json({ success: true, message: { en: "Patient added successfully!", ro: "Pacient a fost adaugat cu succes!" } });
    } catch (e) {
        console.log(e);
        res.status(404).json({ success: false, message: "An error occured." });
    }
};

exports.updatePatient = async (req, res, next) => {

    const { organisationId, patientId, firstname, username, lastname, email, phone, birthdate, cnp, gender, address, doctors, fileNumber, notes, city, county } = req.body;
    console.log(username);
    try {
        let sql = "SHOW DATABASES LIKE ??";
        const organisation = await db.query(sql, [`${process.env.DB_PREFIX}org_${organisationId}`]);
        if (!organisation || !organisation.length) return res.status(404).json({ success: false, message: "An error occured!" });

        if (email && email.length > 0) {
            const emailValidation = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!email.match(emailValidation)) return res.status(200).json({ success: false, message: { en: "Please enter a valid email!", ro: "Va rugam introduceti un email valid!" } });
        }

        const phoneNumberValidation = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        const phoneNumberSecondValidation = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g;

        if (!phone.match(phoneNumberValidation) && !phone.match(phoneNumberSecondValidation)) 
            return res.status(200).json({ success: false, message: { en: "Please enter a valid phone number!", ro: "Va rugam introduceti un numar de telefon valid!" } });

        // Verifying if unique username / email / phone number
        sql = "SELECT * FROM ?? WHERE phone = ? AND _id != ?";

        const phoneUsed = await db.query(sql, [`${process.env.DB_PREFIX}org_${organisationId}.patients`, phone, patientId]);
        console.log(await phoneUsed);
        if (await phoneUsed && await phoneUsed.length > 0) return res.status(200).json({ success: false, message: { en: "Phone number is already used!", ro: "Numarul de telefon este deja inregistrat!" } });
            
        if (email && email.length > 0) {
            sql = "SELECT * FROM ?? WHERE email = ? AND _id != ?";

            const emailUsed = await db.query(sql, [`${process.env.DB_PREFIX}org_${organisationId}.patients`, email, patientId]);
            if (await emailUsed && await emailUsed.length > 0) return res.status(200).json({ success: false, message: { en: "Email is already used!", ro: "Email-ul este deja folosit!" } });
        }

        if (username && username.length > 0) {
            sql = "SELECT * FROM ?? WHERE username = ? AND _id != ?";
            const usernameUsed = await db.query(sql, [`${process.env.DB_PREFIX}org_${organisationId}.patients`, username, patientId]);
            console.log(await usernameUsed);
            if (await usernameUsed && await usernameUsed.length > 0) return res.status(200).json({ success: false, message: { en: "Username is already taken!", ro: "Username-ul este deja inregistrat!" } });
        }

        if (cnp && cnp.length > 0) {
            sql = "SELECT * FROM ?? WHERE cnp = ? AND _id != ?";
            const cnpUsed = await db.query(sql, [`${process.env.DB_PREFIX}org_${organisationId}.patients`, cnp, patientId]);
            if (await cnpUsed && await cnpUsed.length > 0) return res.status(200).json({ success: false, message: {en: "PIC is already used!", ro: "CNP-ul este deja inregistrat!"} });
        }

        if (fileNumber && fileNumber.length > 0) {
            sql = "SELECT * FROM ?? WHERE fileNumber = ? AND id != ?";
            const fileNumberUsed = await db.query(sql, [`${process.env.DB_PREFIX}org_${organisationId}.patients`, fileNumber, patientId]);
            if (await fileNumberUsed && await fileNumberUsed.length > 0) return res.status(200).json({ success: false, message: {en: "File number is already used!", ro: "Numarul de fisa este deja inregistrat!"} });
        }
        // Update every field of patient's account  
        const params = [`${process.env.DB_PREFIX}org_${organisationId}.patients`];
        sql = "UPDATE ?? SET firstname = ?, "; params.push(firstname)
        sql += "lastname = ?, "; params.push(lastname);
        sql += "username = ?, "; params.push(username);
        sql += "email = ?, "; params.push(email);
        sql += "phone = ?, "; params.push(phone);
        sql += "birthdate = ?, "; params.push(birthdate);
        sql += "cnp = ?, "; params.push(cnp);
        sql += "gender = ?, "; params.push(gender);
        sql += "city = ?, "; params.push(city);
        sql += "county = ?, "; params.push(county);
        sql += "address = ?, "; params.push(address);
        sql += "doctors = ?, "; params.push(JSON.stringify(doctors));
        sql += "notes = ?, "; params.push(notes);
        sql += "fileNumber = ? "; params.push(fileNumber);
        sql += "WHERE _id = ?"; params.push(patientId);

        const updatedPatient = await db.query(sql, params);
        if (!await updatedPatient) return new ErrorResponse("An error occured!", 404);
        
        res.status(200).json({ success: true, message: { en: "Patient updated successfully!", ro: "Pacient a fost actualizat cu succes!" } });

    } catch (e) {
        console.log(e);
        res.status(404).json({ success: false, message: "An error occured!" });
    }
};

exports.removePatient = async (req, res, next) => {
    const { _id, patientId } = req.body;

    try {
        let sql = "DELETE FROM ?? WHERE _id = ?";
        const deletedPatient = await db.query(sql, [`${process.env.DB_PREFIX}org_${_id}.patients`, patientId]);
        
        if (!deletedPatient) return new ErrorResponse("An error occured!", 404);
        
        res.status(200).json({ success: true, message: { en: "Patient removed successfully!", ro: "Pacientul a fost sters cu succes!" }});
        
    } catch (e) {
        console.log(e);
        res.status(404).json({ success: false, message: "An error occured!"});
    }
};

exports.getDoctors = async (req, res, next) => {
    const { _id } = req.body;
    try {
        let sql = "SELECT * FROM ?? WHERE type = ?";
        const doctors = db.query(sql, [`${process.env.DB_PREFIX}org_${_id}.users`, "Doctor"]);
   
        res.status(200).json({ success: true, doctors: await doctors });
    } catch (e) {
        res.status(404).json({ success: false, message: "An error occured!" });
    }
};

exports.getLatestSchedules = async (req, res, next) => {
    const { _id } = req.body;
    try {
        let sql = "SELECT * FROM ?? WHERE startDate >= ?";
        const schedules = await db.query(sql, [`${process.env.DB_PREFIX}org_${_id}.schedules`, new Date()]);
    

        res.status(200).json({ success: true, schedules: await schedules });
    } catch (e) {
        console.log(e);
        res.status(404).json({ success: false, message: 'An error occured.' });
    }
};

exports.getPatients = async (req, res, next) => {
    const { _id } = req.body;
    console.log(req.body);
    try {
        let sql = "SELECT * FROM ??";
        const patients = await db.query(sql, [`${process.env.DB_PREFIX}org_${_id}.patients`]);
        if (!patients || !patients.length) return res.status(200).json({ success: false, message: { en: "No patient was found!", ro: "Nu a fost gasit niciun pacient!" }});
        res.status(200).json({ success: true, patients });
    } catch (e) {
        res.status(404).json({ success: false, message: "An error occured." });
    }
};

exports.getSpecificPatient = async (req, res, next) => {
    const { organisationId, patientId } = req.body;
    
};

exports.searchPatient = async (req, res, next) => {
    const { organisationId, searchQuery } = req.body;
    console.log(searchQuery);
    try {
        let sql = "SELECT * FROM ??";
        const totalPatients = await db.query(sql, [`${process.env.DB_PREFIX}org_${organisationId}.patients`]);
        
        const regex = new RegExp("^" + searchQuery, "i");
        const searchedPatients = await totalPatients.filter((patient, idx) => {
            console.log("REGEX", patient.phone.search(searchQuery));
            return patient.firstname.toLowerCase().search(searchQuery.toLowerCase()) !== -1 ||
            patient.lastname.toLowerCase().search(searchQuery.toLowerCase()) !== -1 ||
            patient.phone.toString().toLowerCase().search(searchQuery.toLowerCase()) !== -1 ||
            (patient.username && patient.username.toLowerCase().search(searchQuery.toLowerCase()) !== -1) ||
            (patient.email && patient.email.toLowerCase().search(searchQuery.toLowerCase()) !== -1) ||
            (patient.country && patient.country.toLowerCase().search(searchQuery.toLowerCase()) !== -1)||
            (patient.city && patient.city.toLowerCase().search(searchQuery.toLowerCase()) !== -1) ||
            (patient.county && patient.county.toLowerCase().search(searchQuery.toLowerCase()) !== -1) ||
            (patient.address && patient.address.toLowerCase().search(searchQuery.toLowerCase()) !== -1) ||
            (patient.fileNumber && patient.fileNumber.toString().toLowerCase().search(searchQuery.toLowerCase()) !== -1) ||
            (patient.cnp && patient.PIC.toString().toLowerCase().search(searchQuery.toLowerCase()) !== -1);
        });
        console.log(await searchedPatients);
        if (!await searchedPatients || !await searchedPatients.length > 0) return res.status(200).json({ success: false, message: { en: "No results", ro: "Niciun rezultat" } });
        res.status(200).json({ success: true, patients: await searchedPatients });
    } catch (e) {
        console.log(e);
        res.status(404).json({ success: false, message: { en: "An error occurred!", ro: "A aparut o eroare!" } });
    }
};

exports.getStatisticsData = async (req, res, next) => {
    const { _id } = req.body; 
    

};


const encryptData = (data) => {

};

const sameDate = (date1, date2) => {
    console.log("DATE1", date1.getDate(), date2.getDate());
    return date1.getDate() == date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
};
