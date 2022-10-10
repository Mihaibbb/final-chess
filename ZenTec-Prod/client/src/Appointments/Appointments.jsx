import './Appointments.css';
import Navigation from '../Components/Navigation/Navigation';
import Header from '../Components/Header/Header';
import { useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faAngleDown, faAngleLeft, faAngleRight, faAngleUp, faBan, faMinus, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useCookies } from 'react-cookie';

const Appointments = ({ data }) => {

    const currDay = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

    const [cookies, setCookie] = useCookies();
    const months = cookies.language === "en" ? 
    ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] :
    ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'];

    const daysOfWeek = cookies.language === "en" ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] : ['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sam'];
    const [date, setDate] = useState(new Date());
    const [appointmentDateValue, setAppointmentDateValue] = useState();
    const [month, setMonth] = useState(date.getMonth());
    const [year, setYear] = useState(date.getFullYear());
    const [days, setDays] = useState([date.getDate()]);
    const [hourContainerHeight, setHourContainerHeight] = useState(0);
    const [filters, setFilters] = useState(cookies.language === "en" ? ['Day', 'Working Week', 'Week', 'Month', 'Year'] : ['Zi', 'Saptamana Lucratoare', 'Saptamana', 'Luna', 'An']);
    const [appointments, setAppointments] = useState(data.organisation.schedules);
    
    const [startEvent, setStartEvent] = useState(); 
    const [modifyEvent, setModifyEvent] = useState();
    const [startPosition, setStartPosition] = useState();
    const [lastElement, setLastElement] = useState();
    const [firstElement, setFirstElement] = useState();
    const [newDay, setNewDay] = useState();
    const [filterActive, setFilterActive] = useState(0);
    const [activeCreateAppointment, setActiveCreateAppointment] = useState(false);
    const [activeEditAppointment, setActiveEditAppointment] = useState(false);
    const [appointmentTitle, setAppointmentTitle] = useState("");
    const [appointmentPatient, setAppointmentPatient] = useState("");
    const [appointmentPatientData, setAppointmentPatientData] = useState();
    const [appointmentStartHour, setAppointmentStartHour] = useState("");
    const [appointmentEndHour, setAppointmentEndHour] = useState("");
    const [appointmentStartMinutes, setAppointmentStartMinutes] = useState("");
    const [appointmentEndMinutes, setAppointmentEndMinutes] = useState("");
    const [appointmentCost, setAppointmentCost] = useState("");
    const [appointmentTypeIncome, setAppointmentTypeIncome] = useState("LEI");
    const [appointmentNotes, setAppointmentNotes] = useState("");
    const [appointmentPatientsList, setAppointmentPatientsList] = useState([]);
    const [appointmentId, setAppointmentId] = useState();
    const [statusMessage, setStatusMessage] = useState();
    const [activeGaps, setActiveGaps] = useState(false);

    const hours = [];
    const filterRef = useRef();
    const scheduleRef = useRef();
    const doctorRef = useRef([]);
    const gapsRef = useRef([]);

    const location = useLocation();
    // const { startHour, endHour, gaps, doctors } = location?.state;
    const startHour = 9;
    const endHour = 18;
    const gaps = 4;
    const minutesPerGap = 60 / gaps;
    const doctors = data.user.type.toLowerCase() === "doctor" ? [data.user.name] : null;
    for (let hour = startHour; hour <= endHour; hour++)  {
        hours.push(hour);   
    }

    const getSchedule = (dayFormat) => {
        const gapsArr = [];
   
        for (let gap = 0; gap < gaps; gap++)
            gapsArr.push(gap);

        return hours.map((hour, idx) => {
            return (<div className={`schedule-hour ${idx === hours.length - 1 ? "inactive" : ""}`} key={idx} ref={!scheduleRef.current && idx === 0 ? scheduleRef : null}>
                {gapsArr.map((gap, gapIdx) => (
                    <div className="gap" 
                        key={gapIdx} 
                        id={(idx * gaps + gapIdx).toString()}
                       
                        starthour={idx + startHour < 10 ? `0${idx + startHour}` : (idx + startHour).toString()}
                        startminutes={gapIdx * minutesPerGap < 10 ? `0${gapIdx * minutesPerGap}` : gapIdx * minutesPerGap < 60 ? (gapIdx * minutesPerGap).toString() : "0"}
                        endhour={(gapIdx + 1) * minutesPerGap < 60 ? (idx + startHour < 10 ? `0${idx + startHour}` : (idx + startHour).toString()) : (idx + startHour + 1 < 10 ? `0${idx + startHour + 1}` : (idx + startHour + 1).toString())}
                        endminutes={(gapIdx + 1) * minutesPerGap < 10 ? `0${(gapIdx + 1) * minutesPerGap}` : (gapIdx + 1) * minutesPerGap < 60 ? ((gapIdx + 1) * minutesPerGap).toString() : "0"}
                        day={dayFormat.toString()}
                        ref={gapsRef} 
                        onMouseDown={(e) => initiateAppointment(e, idx, gapIdx)}
                        onMouseMove={(e) => moveAppointment(e)}
                        onMouseUp={(e) => createAppointment(e)}
                        onTouchStart={e => initiateAppointment(e, idx, gapIdx)}
                        onTouchMove={e => moveAppointment(e)}
                        onTouchEnd={e => createAppointment(e)}
                    >
                        {firstElement?.getAttribute('id') === (idx * gaps + gapIdx).toString() && 
                        firstElement?.getAttribute('day') === dayFormat.toString() &&
                            <p className='appointment-interval'>{appointmentStartHour}:{appointmentStartMinutes < 10 ? `0${appointmentStartMinutes}` : appointmentStartMinutes} - {appointmentEndHour}:{appointmentEndMinutes < 10 ? `0${appointmentEndMinutes}` : appointmentEndMinutes}</p>
                        }
                    </div>
                ))}
            </div>);
        });
    };

    const initiateAppointment = (e, currHour, gap) => {
        if (date.getFullYear() < new Date().getFullYear() || date.getMonth() < new Date().getMonth() || date.getDate() < new Date().getDate()) return;
        if (e.button === 2) return; // check for right click
        if (modifyEvent) return;
        const target = e.target.classList.contains("gap") ? e.target : e.target.parentElement;
        if (target.classList.contains('highlight')) return;
        console.log(new Date(date.getFullYear(), date.getMonth(), e.target.getAttribute('day')));
        setAppointmentDateValue(filterActive === 0 ? date : new Date(e.target.getAttribute('day')));
        setStartEvent(true);
        setStartPosition(e.clientY);
        setFirstElement(target);
        setAppointmentStartHour(currHour + startHour);
        setAppointmentStartMinutes(gap * minutesPerGap);
 
        setAppointmentEndMinutes((gap + 1) * minutesPerGap >= 60 ? 0 : (gap + 1) * minutesPerGap);
        setAppointmentEndHour((gap + 1) * minutesPerGap >= 60 ? currHour + startHour + 1 : currHour + startHour);
        setLastElement(target);
    };

    const moveAppointment = e => {
        
        if (!startEvent || modifyEvent) return;
        if (startPosition >= e.clientY) return;
        if (e.target.classList.contains("highlight") && parseInt(e.target.getAttribute('id')) > parseInt(lastElement.getAttribute('id'))) return;
        if (e.target.parentElement.classList.contains("inactive")) return;
        const lastPos = lastElement.getBoundingClientRect();
        const currPos = e.target.getBoundingClientRect();
        console.log(firstElement);
        if (!firstElement.classList.contains('highlight')) firstElement.classList.add("highlight");
        setAppointmentEndHour(e.target.getAttribute('endhour'));
        setAppointmentEndMinutes(e.target.getAttribute('endminutes'));
        
        if (parseInt(e.target.getAttribute('id')) < parseInt(lastElement.getAttribute('id'))) {
            for (let i = parseInt(e.target.getAttribute('id')) + 1; i <= parseInt(lastElement.getAttribute('id')); i++) {
                const child = lastElement.parentElement.parentElement.querySelector(`[id="${i.toString()}"]`);
                console.log(i, lastElement.parentElement.parentElement.querySelector(`[id="${i}"]`) );
                child.classList.remove("highlight");
            }
        }
        else if (parseInt(e.target.getAttribute('id')) > parseInt(lastElement.getAttribute('id'))) {
            for (let i = parseInt(lastElement.getAttribute('id')) + 1; i <= parseInt(e.target.getAttribute('id')); i++) {
                const child = lastElement.parentElement.parentElement.querySelector(`[id="${i.toString()}"]`);
                console.log(i, lastElement.parentElement.parentElement.querySelector(`[id="${i}"]`) );
                child.classList.add("highlight");
            }
        }

        setLastElement(e.target);
    };
    
    const createAppointment = (e) => {
        console.log('here');
        
        if (!startEvent || modifyEvent) return;
        setActiveCreateAppointment(true);
        
        setStartEvent(false);
        setStartPosition(false);
        
        // Send appointment to database
    };

    const sendAppointment = async () => {

        const appointmentData = {
            startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate(), appointmentStartHour, appointmentStartMinutes),
            endDate: new Date(date.getFullYear(), date.getMonth(), date.getDate(), appointmentEndHour, appointmentEndMinutes),
            patients: [appointmentPatientData],
            users: [cookies['user-id']],
            _id: data.organisation._id,
            title: appointmentTitle,
            income: appointmentCost,
            typeIncome: appointmentTypeIncome,
            notes: appointmentNotes,
            date: date
        };

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(appointmentData)
        };

        const request = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/create-appointment`, options);
        const response = await request.json();
        if (response.success) {
            setAppointments(currAppointments => [...currAppointments, appointmentData]);
            setStatusMessage(response.message[cookies.language]);
            setActiveCreateAppointment(false);
            setLastElement(null);
            setFirstElement(null);
        }
       
    };

    const closeCreateAppointment = () => {
        console.log(firstElement, lastElement);
        if (!firstElement || !lastElement) return;
        let currentId = parseInt(firstElement.getAttribute('id'));
        const finalId = parseInt(lastElement.getAttribute('id'));
        const currentDay = firstElement.getAttribute('day');
        while (currentId <= finalId) {
            const currentElement = document.querySelector(`.gap[id="${currentId.toString()}"][day="${currentDay}"]`)
            currentElement.classList.remove("highlight");
        
            currentId++;
        }
        
        setActiveCreateAppointment(false);
        setAppointmentStartHour("");
        setAppointmentStartMinutes("");
        setAppointmentEndHour("");
        setAppointmentEndMinutes("");

        setFirstElement(null);
        setLastElement(null);
    };

    const editAppointment = async (currentAppointmentId) => {

        const appointmentData = {
            startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate(), appointmentStartHour, appointmentStartMinutes),
            endDate: new Date(date.getFullYear(), date.getMonth(), date.getDate(), appointmentEndHour, appointmentEndMinutes),
            patients: [appointmentPatientData],
            users: [cookies['user-id']],
            _id: data.organisation._id,
            title: appointmentTitle,
            income: appointmentCost,
            typeIncome: appointmentTypeIncome,
            notes: appointmentNotes,
            date: date,
            appointmentId: currentAppointmentId
        };

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(appointmentData)
        };

        const request = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/update-appointment`, options);
        const response = await request.json();
        if (response.success) {
            setStatusMessage(response.message[cookies.language]);
            setActiveEditAppointment(false);
        }
    };

    const removeAppointment = async (appointmentId1) => {
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                _id: data.organisation._id,
                appointmentId: appointmentId1
            })
        };

        const request = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/remove-appointment`, options);
        const response = await request.json();
        if (response.success) {
            setStatusMessage(response.message[cookies.language]);
            setActiveEditAppointment(false);
            
            setAppointments(currAppointments => {
                return currAppointments.filter(currAppointment => {
                    return currAppointment._id !== appointmentId;
                });
            });
        }
    };

    const sameDay = (date1, date2) => {
        return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
    };


    useEffect(() => {
        if (!scheduleRef.current) return;
        console.log(scheduleRef.current.offsetHeight);
        setHourContainerHeight(scheduleRef.current.offsetHeight / 2);
    }, [scheduleRef]);

    useEffect(() => {
        if (!doctorRef.current) return;
        // For changing doctor's color
        // doctors.forEach((doctor, idx) => {
        //     doctorRef.current[idx].style.setProperty('--doctor-color', doctor.color);
        // });
    }, [doctorRef]);

    useEffect(() => {
        if (month === date.getMonth() && year === date.getFullYear()) return;
        setDate(new Date(year, month, 1));
    }, [year, month]);

    useEffect(() => {
        console.log(appointments);
        const currentGaps = document.querySelectorAll('.gap');

        currentGaps.forEach(gap => {
            gap.classList.remove("highlight");
            gap.classList.remove("created");
            gap.classList.remove("resizeable");
            gap.classList.remove("resizeable-up");
            gap.classList.remove("resizeable-down");
            while (gap?.firstChild) {
                console.log('here');
                gap.removeChild(gap.firstChild);
                console.log('here2');
            }
        });

        console.log(days);
        console.log(appointments);
        if (filterActive === 3 || filterActive === 4) return;
        
        const currentAppointments = filterActive === 0 ? appointments.filter((appointment) => {
            console.log(appointment);
            let sameDoctor = false;
            if (data?.user?.type.toLowerCase() === "doctor") {
                console.log(data.user, JSON.parse(appointment.users));
                const id = data.user?.userId;
                sameDoctor = JSON.parse(appointment.users).some(user => user === id);
            }
            console.log(sameDoctor);
            return sameDay(new Date(appointment.date), date) && (data.user.type.toLowerCase() === "doctor" ? sameDoctor : true);
        }) : appointments.filter((appointment) => {
            console.log(appointment);
            return (
                days[0].getMonth() <= new Date(appointment.date).getMonth() &&
                days[0].getFullYear() <= new Date(appointment.date).getFullYear() &&
                days[0].getDate() <= new Date(appointment.date).getDate()) && (
                new Date(appointment.date).getFullYear() <= days[days.length - 1].getFullYear() && 
                new Date(appointment.date).getMonth() <= days[days.length - 1].getMonth() &&
                new Date(appointment.date).getDate() <= days[days.length - 1].getDate()
            );
        });

        console.log(currentAppointments);
        
        currentAppointments.forEach((appointment) => {
            console.log(appointment);
            const appointmentDate = new Date(appointment.startDate);
            const startHourAppointment = appointmentDate.getHours();
            const startMinutesAppointment = appointmentDate.getMinutes();
            
            const endHourAppointment = new Date(appointment.endDate).getHours();
            const endMinutesAppointment = new Date(appointment.endDate).getMinutes();
            console.log(startHourAppointment, startMinutesAppointment, endHourAppointment, endMinutesAppointment)
            let startIdx, endIdx;
            
            currentGaps.forEach((gap, gapIdx) => {
                if (Number(gap.getAttribute('starthour')) === startHourAppointment &&
                    Number(gap.getAttribute('startminutes')) === startMinutesAppointment && 
                    (filterActive !== 0 ? sameDay(new Date(gap.getAttribute('day')), appointmentDate) : true)
                ) {
                    console.log(gapIdx, startHourAppointment, startMinutesAppointment);

                    startIdx = gapIdx;
                }

                if (Number(gap.getAttribute('endhour')) === endHourAppointment && 
                    Number(gap.getAttribute('endminutes')) === endMinutesAppointment && 
                    (filterActive !== 0 ? sameDay(new Date(gap.getAttribute('day')), appointmentDate) : true)
                ) {
                    console.log(gapIdx, endHourAppointment, endMinutesAppointment);
                    endIdx = gapIdx;
                }
            });

            console.log(startIdx, endIdx);
           
            for (let i = startIdx; i <= endIdx; i++) {
                currentGaps[i].classList.add('highlight');
                currentGaps[i].classList.add('created');
                currentGaps[i].addEventListener('click', () => {
                    console.log(appointment)

                    setActiveEditAppointment(true);
                    setAppointmentTitle(appointment.title);
                    setAppointmentPatient(`${appointment.patients[0].firstname} ${appointment.patients[0].lastname}`);
                    setAppointmentPatientsList([]);
                    setAppointmentPatientData(appointment.patients[0]);
                    setAppointmentStartHour(new Date(appointment.startDate).getHours() < 10 ? `0${new Date(appointment.startDate).getHours()}` : new Date(appointment.startDate).getHours());
                    setAppointmentStartMinutes(new Date(appointment.startDate).getMinutes() < 10 ? `0${new Date(appointment.startDate).getMinutes()}` : new Date(appointment.startDate).getMinutes());
                    setAppointmentEndHour(new Date(appointment.endDate).getHours() < 10 ? `0${new Date(appointment.endDate).getHours()}` : new Date(appointment.endDate).getHours());
                    setAppointmentEndMinutes(new Date(appointment.endDate).getMinutes() < 10 ? `0${new Date(appointment.endDate).getMinutes()}` : new Date(appointment.endDate).getMinutes());
                    setAppointmentCost(appointment.income);
                    setAppointmentId(appointment._id);
                    setAppointmentNotes(appointment.notes);
                });
            }
            console.log(currentGaps);
            const textElement = document.createElement('p');
            textElement.classList.add('appointment-interval');
            textElement.innerText = `${startHourAppointment < 10 ? `0${startHourAppointment}` : startHourAppointment}:${startMinutesAppointment < 10 ? `0${startMinutesAppointment}` : startMinutesAppointment} - ${endHourAppointment < 10 ? `0${endHourAppointment}` : endHourAppointment}:${endMinutesAppointment < 10 ? `0${endMinutesAppointment}` : endMinutesAppointment}`;
            currentGaps[startIdx].appendChild(textElement);
            currentGaps[startIdx].classList.add("resizeable");
            currentGaps[startIdx].classList.add("resizeable-up");

            
          

            // currentGaps.forEach(gap => {

            //     gap.addEventListener("mousedown", e => {
            //         console.log(e.target);
            //         if (!e.target.classList.contains("resizeable") || !e.target.classList.contains("resizeable-up")) return;
            //         setStartEvent(true);
            //         setLastElement(e.target);
            //         setStartPosition(e.clientY);
            //         setModifyEvent(true);
            //     });

            //     gap.addEventListener("mousemove", e => {
            //         console.log(startEvent, lastElement);
            //         if (!startEvent || !lastElement) return;
            //         console.log(e.target);
            //         while (e.target && !e.target.classList.contains("gap")) {
            //             e.target = e.target?.parentElement;
            //         }
            //         console.log(e.target !== lastElement);

            //         if (e.target === lastElement) return;

            //         if (e.clientY < startPosition) {
            //             e.target.classList.add("highlight");
            //             console.log("ADD");
            //         } else {
            //             e.target.classList.remove("highlight");
            //         }
                  
            //         setStartPosition(e.target);
            //         setLastElement(e.target);
                    
                    
                   
            //     });

            //     gap.addEventListener("mouseup", e => {
            //         setStartEvent(false);
            //         setModifyEvent(false);
            //         setLastElement();
                    

            //     });
            // });    

            const titleAppointmentElement = document.createElement('p');
            titleAppointmentElement.classList.add("appointment-interval");
            titleAppointmentElement.innerText = appointment.title;
            
            titleAppointmentElement.style.top = 'calc(-100% + 24px)';
            currentGaps[startIdx].appendChild(titleAppointmentElement);

            currentGaps[endIdx].classList.add("resizeable");
            currentGaps[endIdx].classList.add("resizeable-down");

            currentGaps[endIdx].addEventListener("mousedown", () => {
                
            });

            currentGaps[endIdx].addEventListener("mousemove", () => {
                
            });

            currentGaps[endIdx].addEventListener("mouseup", () => {
                
            });

            const activeGaps = [...currentGaps].filter(currentGap => currentGap.classList.contains("highlight") && currentGap.classList.contains("created"));

            // Hover appointment event
            console.log(activeGaps);
            activeGaps.forEach((currentGap, idx) => {
                currentGap.addEventListener("mouseover", e => {
                    let firstIdx = idx, lastIdx = idx;
                    while (!activeGaps[firstIdx].classList.contains("resizeable-up")) {
                        activeGaps[firstIdx].classList.add("mouse-over-gap");
                        if (firstIdx === 0) break;
                        firstIdx--;
                    }
                    
                    if (firstIdx >= 0) activeGaps[firstIdx].classList.add("mouse-over-gap");
                    
                    while (!activeGaps[lastIdx].classList.contains("resizeable-down")) {
                        activeGaps[lastIdx].classList.add("mouse-over-gap")
                        if (lastIdx === activeGaps.length - 1) break;
                        lastIdx++;
                    }

                    if (lastIdx <= activeGaps.length - 1) activeGaps[lastIdx].classList.add("mouse-over-gap")

                });

                currentGap.addEventListener("mouseout", e => {
                     
                    let firstIdx = idx, lastIdx = idx;
                    while (!activeGaps[firstIdx].classList.contains("resizeable-up")) {
                        activeGaps[firstIdx].classList.remove("mouse-over-gap")
                        if (firstIdx === 0) break;
                        firstIdx--;
                    }

                    if (firstIdx >= 0) activeGaps[firstIdx].classList.remove("mouse-over-gap");
                    
                    while (!activeGaps[lastIdx].classList.contains("resizeable-down")) {
                        activeGaps[lastIdx].classList.remove("mouse-over-gap")
                        if (lastIdx === activeGaps.length - 1) break;
                        lastIdx++;
                    }

                    if (lastIdx <= activeGaps.length - 1) activeGaps[lastIdx].classList.remove("mouse-over-gap")
                });
            });
            // currentGaps[startIdx].innerHTML = `<p class='appointment-interval'>${startHourAppointment < 10 ? `0${startHourAppointment}` : startHourAppointment}:${startMinutesAppointment < 10 ? `0${startMinutesAppointment}` : startMinutesAppointment}-${endHourAppointment < 10 ? `0${endHourAppointment}` : endHourAppointment}-${endMinutesAppointment < 10 ? `0${endMinutesAppointment}` : endMinutesAppointment}<br /> ${appointment.title}</p>`;
            
        });
    }, [date, appointments, filterActive, days]);

    useEffect(() => {
        if (appointmentPatient === "") {
            setAppointmentPatientsList([]);
            return;
        }
        (async () => {
            const options = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    organisationId: data.organisation._id,
                    searchQuery: appointmentPatient
                })
            };

            const request = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/search-patient`, options);
            const response = await request.json();
            if (response.success) setAppointmentPatientsList(response.patients);

        })();
    }, [appointmentPatient]);

    const setWorkingWeek = () => {
        let currDate = date;
        if (currDate.getDay() === 6) currDate = new Date(currDate.getTime() - 24 * 60 * 60 * 1000);
        if (currDate.getDay() === 0) currDate = new Date(currDate.getTime() + 24 * 60 * 60 * 1000);

        let dayIdx = currDate.getDay();
        
        const currWeek = [];

        currWeek.push(currDate);


        while (dayIdx < 5) {
            currDate = new Date(currDate.getTime() + 24 * 60 * 60 * 1000);
            currWeek.push(currDate);
            dayIdx++;
        } 

        currDate = date;      

        if (currDate.getDay() === 6) currDate = new Date(currDate.getTime() - 24 * 60 * 60 * 1000);
        if (currDate.getDay() === 0) currDate = new Date(currDate.getTime() + 24 * 60 * 60 * 1000);
        dayIdx = currDate.getDay();
        
        while (dayIdx > 1) {
            currDate = new Date(currDate.getTime() - 24 * 60 * 60 * 1000);
            currWeek.unshift(currDate);
            console.log("unshift");
            dayIdx--;
        }

        return currWeek;
    };

    const setWeek = () => {

        let currDate = date;
        if (currDate.getDay() === 6) currDate = new Date(currDate.getTime() - 24 * 60 * 60 * 1000);
        if (currDate.getDay() === 0) currDate = new Date(currDate.getTime() + 24 * 60 * 60 * 1000);

        let dayIdx = currDate.getDay();
        
        const currWeek = [];

        currWeek.push(currDate);


        while (dayIdx <= 5) {
            currDate = new Date(currDate.getTime() + 24 * 60 * 60 * 1000);
            currWeek.push(currDate);
            dayIdx++;
        } 

        currDate = date;
        if (currDate.getDay() === 6) currDate = new Date(currDate.getTime() - 24 * 60 * 60 * 1000);
        if (currDate.getDay() === 0) currDate = new Date(currDate.getTime() + 24 * 60 * 60 * 1000);
        dayIdx = currDate.getDay();
        
        while (dayIdx >= 1) {
            currDate = new Date(currDate.getTime() - 24 * 60 * 60 * 1000);
            currWeek.unshift(currDate);
            console.log("unshift");
            dayIdx--;
        }

        // First day (sunday) must be the last day

  
        currWeek.shift();
        const addDay = new Date(currWeek[currWeek.length - 1].getTime() + 24 * 60 * 60 * 1000);
        currWeek.push(addDay);
        return currWeek;
    };

    const getMonthData = () => {
        const daysInMonth = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
        console.log(new Date(date.getFullYear(), date.getMonth(), 0));
        const dayComponents = [];
        const firstDate = date;
        for (let currDay = 1; currDay <= daysInMonth; currDay++) {
            const currDate = new Date(date.getFullYear(), date.getMonth(), currDay);
            console.log(currDate);
            const currAppointments = appointments.filter((appointment, idx) => {
               
                return new Date(appointment.startDate).getDate() === currDate.getDate() && 
                new Date(appointment.startDate).getMonth() === currDate.getMonth() && currDate.getFullYear() === currDate.getFullYear();
            });
            console.log(currAppointments, currDay);
            dayComponents.push(
                <div className="month-day" key={currDay} onDoubleClick={() => {
                    setDate(currDate => new Date(currDate.getFullYear(), currDate.getMonth(), currDay));
                    setFilterActive(0);
                }}>
                    <p className={`day-number`} onClick={() => {
                        setDate(currDate => new Date(currDate.getFullYear(), currDate.getMonth(), currDay));
                        setFilterActive(0);
                    }}>{currDay}</p>
                    <div className="month-appointments">
                        {currAppointments.map((appointment, idx) => (
                            <div className="month-appointment" onClick={() => {
                                setActiveEditAppointment(true);
                                setAppointmentTitle(appointment.title);
                                setAppointmentPatient(`${appointment.patients[0].firstname} ${appointment.patients[0].lastname}`);
                                setAppointmentPatientsList([]);
                                setAppointmentPatientData(appointment.patients[0]);
                                setAppointmentStartHour(new Date(appointment.startDate).getHours() < 10 ? `0${new Date(appointment.startDate).getHours()}` : new Date(appointment.startDate).getHours());
                                setAppointmentStartMinutes(new Date(appointment.startDate).getMinutes() < 10 ? `0${new Date(appointment.startDate).getMinutes()}` : new Date(appointment.startDate).getMinutes());
                                setAppointmentEndHour(new Date(appointment.endDate).getHours() < 10 ? `0${new Date(appointment.endDate).getHours()}` : new Date(appointment.endDate).getHours());
                                setAppointmentEndMinutes(new Date(appointment.endDate).getMinutes() < 10 ? `0${new Date(appointment.endDate).getMinutes()}` : new Date(appointment.endDate).getMinutes());
                                setAppointmentCost(appointment.income);
                                setAppointmentId(appointment._id);
                                setAppointmentNotes(appointment.notes);
                            }}>
                                <p>{appointment.title.substring(0, 9)}{appointment.title.length <= 10 ? "" : ".."}</p>
                                <p>{new Date(appointment.startDate).getHours()}:{new Date(appointment.startDate).getMinutes()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return dayComponents;
    };

    const getYearData = () => {
        return months.map((currMonth, monthIdx) => {
            const daysInMonth = new Date(date.getFullYear(), monthIdx + 1, 0).getDate();
            const currDays = [];
            for (let currDay = 1; currDay <= daysInMonth; currDay++) 
                currDays.push(currDay);

            return (
                <div className="year-month-container" key={monthIdx}>
                    <p className="month-number" onClick={() => {
                        setMonth(monthIdx);
                        setDate(currDate => new Date(currDate.getFullYear(), monthIdx, 1));
                        setFilterActive(3);
                    }}>{currMonth}</p>
                    <div className="month-data" key={monthIdx}>
                        {currDays.map((currDay, dayIdx) => (
                            <div className="month-day" key={dayIdx}>
                                <p className="day-number" onClick={() => {
                                    setDate(currDate => new Date(currDate.getFullYear(), monthIdx, currDay))
                                    setFilterActive(0);
                                }}>{currDay}</p>
                            </div>
                        ))}
                    </div>
                </div>
            );
        });
    };

    

    return (
        <div className="appointments">
            <Navigation page="appointments" />

            <div className="content">
                <Header data={data} />
                <div className="filter" ref={filterRef}>
                    {filterRef && filterRef.current && filters.map((filter, idx) => (
                        <div key={idx} className={idx === filterActive ? "active" : ""} onClick={e => {
                         
                            setFilterActive(idx);
                            if (idx === 0) setDays([date]);
                            if (idx === 1) setDays(setWorkingWeek());
                            else if (idx === 2) setDays(setWeek());
                       }}>
                            <p>{filter}</p>
                        </div>
                    ))}
                </div>
                
       
                <div className="day-title">
                    <div className="half">
                        <div className="title-btn" onClick={() => {
                            if (filterActive === 0) setDate(currDate => {
                                return new Date(currDate.getTime() - 24 * 60 * 60 * 1000);
                            });
                            else if (filterActive === 1 || filterActive === 2) setDays(currDays => {
                                console.log(currDays);
                                const newDays = currDays.map(currDay => {
                                    console.log(currDay);
                                    return new Date(currDay.getTime() - 7 * 24 * 60 * 60 * 1000)
                                });
                                setMonth(newDays[newDays.length - 1].getMonth());
                                return newDays;
                            });

                            else if (filterActive === 3) {
                                if (month === 0) {
                                    setMonth(11);
                                    setYear(currYear => currYear - 1);
                                }
                                else setMonth(currMonth => currMonth - 1);
                            }

                            else if (filterActive === 4) {
                                if (year < 0) return;
                                setYear(currYear => currYear - 1);
                            }
                            
                        }}>
                            <FontAwesomeIcon icon={faAngleLeft} className="title-icon" />
                        </div>
                        <p>
                            {
                                filterActive === 0 ? `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}` :
                                filterActive === 1 || filterActive === 2 ? `${days[0].getDate()} - ${days[days.length - 1].getDate()} ${months[month]} ${year}` :
                                filterActive === 3 ? `${months[month]} ${year}`:
                                filterActive === 4 ? `${year}` :
                                null
                            }
                        </p>
                        <div className="title-btn" onClick={() => {
                            if (filterActive === 0) setDate(currDate => {
                                return new Date(currDate.getTime() + 24 * 60 * 60 * 1000);
                            });
                            else if (filterActive === 1 || filterActive === 2) setDays(currDays => {
                                console.log(currDays);
                                const newDays = currDays.map(currDay => {
                                    console.log(currDay);
                                    return new Date(currDay.getTime() + 7 * 24 * 60 * 60 * 1000)
                                });
                                setMonth(newDays[newDays.length - 1].getMonth());
                                return newDays;
                            }); 
                            else if (filterActive === 3) {
                                
                                if (month === 11) {
                                    setMonth(0);
                                    setYear(currYear => currYear + 1);
                                }
                                else setMonth(currMonth => currMonth + 1);

                                
                            }
                            else if (filterActive === 4) {
                                setYear(currYear => currYear + 1);
                            }
                        }}>
                            <FontAwesomeIcon icon={faAngleRight} className="title-icon" />
                        </div>
                    </div>

                    <div className="half">
                        <p className="normal-text" onClick={() => {
                            setDate(new Date());
                            setFilterActive(0);
                            setDays([new Date()]);
                        }}>{cookies.langauge === "en" ? "Today" : "Astazi"}</p>
                    </div>
                </div>

                <div className="options">
                    <div className="option">
                        <div className={`option-icon ${activeGaps ? "active" : ""}`} onClick={() => setActiveGaps(currStatus => !currStatus)}>
                            {activeGaps && <FontAwesomeIcon icon={faCheck} className="tick-icon" />}
                        </div>
                        <p>{cookies.language === "en" ? "Visible intervals" : "Intervale vizibile"}</p>
                    </div>
                </div>
            
                <div className="scheduler">
                    {filterActive !== 3 && filterActive !== 4 && 
                        <div className="hours">
                        {hours.map((hour, hourIdx) => (
                            <div className="hour" key={hourIdx}>
                                <p>{hour < 10 ? `0${hour}:00` : `${hour}:00`}</p>
                            </div>
                        ))}
                        </div>
                    }

                    <div className="schedules" style={{ marginTop: hourContainerHeight }}>
                        {doctors && doctors.length > 0 && doctors.map((doctor, idx) => (
                            filterActive !== 3 && filterActive !== 4 ? 
                            <div className={`schedule-container ${activeGaps ? "active-gaps" : ""}`} key={idx} ref={ref => doctorRef.current[idx] = ref}>
                                {days.map((day, dayIdx) => (
                                    filterActive === 0 ? (
                                        <div className="day-container" key={dayIdx}>
                                            {getSchedule(day)}
                                        </div>
                                    ) : filterActive === 1 || filterActive === 2 ? (
                                        <div key={dayIdx} className="day-of-week-container">
                                            <h2>{`${daysOfWeek[day.getDay()]} ${day.getDate()}`}</h2>
                                            <div className="day-container" >
                                                {getSchedule(day)}
                                            </div>
                                        </div>
                                    ) : null
                                   
                                ))}
                                
                            </div> : filterActive === 3 ?
                            <div className="month-schedule" key={idx} ref={ref => doctorRef.current[idx] = ref}>
                                {getMonthData()}
                            </div> : filterActive === 4 ?
                            <div className="year-schedule" key={idx} ref={ref => doctorRef.current[idx] = ref}>
                                {getYearData()}
                            </div> : null
                        ))}
                    </div>
                    
                </div>

                <div className={`appointment-details ${activeCreateAppointment ? "active" : ""}`}>
                    <div className="appointment-details-card">
                        <div className="close-button">
                            <FontAwesomeIcon icon={faTimes} className="close-icon" onClick={() => closeCreateAppointment()} />
                        </div>

                        <h2 className="appointment-details-title">{cookies.language === "en" ? "Appointment Details" : "Detalii programare"}</h2>
                    
                        <div className="appointment-details">
                            <div className="label one-row">
                                <p>{cookies.languge === "en" ? "Title" : "Titlu"}</p>
                                <input type="text" value={appointmentTitle} onChange={e => setAppointmentTitle(e.target.value)} placeholder={cookies.language === "en" ? "Title" : "Titlu"} className="row" />
                            </div>

                            <div className="label one-row">
                                <p>{cookies.language === "en" ? "Patient" : "Pacient"}</p>
                                <input type="text" value={appointmentPatient} onChange={e => setAppointmentPatient(e.target.value)} placeholder={cookies.language === "en" ? "Patient" : "Pacient"} />
                                {appointmentPatientsList && appointmentPatientsList.length !== 0 ?
                                    <div className="patient-list">
                                        {appointmentPatientsList.map((patient, idx) => (
                                            <div className="patient-container" onClick={() => {
                                                setAppointmentPatient(`${patient.firstname} ${patient.lastname}`);
                                                setAppointmentPatientsList([]);
                                                setAppointmentPatientData(patient);
                                            }}>
                                                <p>{patient.firstname} {patient.lastname} {patient.fileNumber || idx + 1}</p>
                                            </div>
                                        ))}
                                    </div> : appointmentPatient.length > 0 &&
                                    <div>
                                        <p className="normal-text">{cookies.language === "en" ? "No patients found" : "Niciun pacient gasit"}</p>
                                        <div className="line-patient">
                                            <p className="normal-text">{cookies.language === "en" ? "Do you want to add a new patient?" : "Doriti sa adaugati un pacient nou?"}</p>
                                            <button>{cookies.language === "en" ? "YES" : "DA"}</button>
                                            <button>{cookies.language === "en" ? "NO" : "NU"}</button>
                                        </div>
                                    </div>
                                }
                            </div>

                            <div className="label">
                                <p>{cookies.language === "en" ? "Start Hour" : "Ora inceput"}</p>
                                <div className="label-row">
                                    <div className="input">
                                        <input type="number" onChange={e => setAppointmentStartHour(e.target.value)} placeholder={cookies.language === "en" ? "Hour" : "Ora"} value={appointmentStartHour < 10 ? `0${appointmentStartHour}` : appointmentStartHour} />
                                        <div className="scale">
                                            <FontAwesomeIcon icon={faAngleUp} className="scale-icon" onClick={() => (Number(appointmentStartHour) + 1 <= endHour) && setAppointmentStartHour(value => Number(value) + 1)} />
                                            <FontAwesomeIcon icon={faAngleDown} className="scale-icon" onClick={() => (Number(appointmentStartHour) - 1 >= startHour) && setAppointmentStartHour(value => Number(value) - 1)} />
                                        </div>

                                    </div>
                                    <div className="input">
                                        <input type="number" value={appointmentStartMinutes < 10 ? `0${appointmentStartMinutes}` : appointmentStartMinutes} onChange={e => setAppointmentStartMinutes(e.target.value)} placeholder={cookies.language === "en" ? "Minutes" : "Minute"}  />
                                        <div className="scale">
                                            <FontAwesomeIcon icon={faAngleUp} className="scale-icon" onClick={() => {
                                                if (Number(appointmentStartMinutes) + minutesPerGap < 60) setAppointmentStartMinutes(value => Number(value) + minutesPerGap) 
                                                else if (Number(appointmentStartHour) < endHour) {
                                                    setAppointmentStartHour(currHour => Number(currHour) + 1);
                                                    setAppointmentStartMinutes(0);
                                                }
                                            }} />
                                            <FontAwesomeIcon icon={faAngleDown} className="scale-icon" onClick={() => {
                                                if (Number(appointmentStartMinutes) - minutesPerGap >= 0) setAppointmentStartMinutes(value => value - minutesPerGap);
                                                else if (Number(appointmentStartHour) > startHour) {
                                                    setAppointmentStartHour(currHour => Number(currHour) - 1);
                                                    setAppointmentStartMinutes(60 - minutesPerGap);
                                                }
                                            }} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="label">
                                <p>{cookies.language === "en" ? "End Hour" : "Ora sfarsit"}</p>
                                <div className="label-row">
                                    <div className="input">
                                        <input type="number" placeholder={cookies.language === "en" ? "Hour" : "Ora"} value={appointmentEndHour < 10 ? `0${appointmentEndHour}` : appointmentEndHour} onChange={e => setAppointmentEndHour(e.target.value)} />
                                        <div className="scale">
                                            <FontAwesomeIcon icon={faAngleUp} className="scale-icon" onClick={() => Number(appointmentEndHour) + 1 <= endHour && setAppointmentEndHour(value => Number(value) + 1)} />
                                            <FontAwesomeIcon icon={faAngleDown} className="scale-icon" onClick={() => Number(appointmentEndHour) - 1 >= startHour && setAppointmentEndHour(value => Number(value) - 1)} />
                                        </div>
                                    </div>

                                    <div className="input">
                                        <input type="number" placeholder={cookies.language === "en" ? "Minutes" : "Minute"} value={appointmentEndMinutes < 10 ? `0${appointmentEndMinutes}` : appointmentEndMinutes} onChange={e => setAppointmentEndMinutes(e.target.value)} />
                                        <div className="scale">
                                            <FontAwesomeIcon icon={faAngleUp} className="scale-icon" onClick={() => {
                                                if (Number(appointmentEndMinutes) + minutesPerGap < 60) setAppointmentEndMinutes(value => Number(value) + minutesPerGap);
                                                else if (Number(appointmentEndHour) < endHour) {
                                                    setAppointmentEndHour(currHour => Number(currHour) + 1);
                                                    setAppointmentEndMinutes(0);
                                                }
                                            }} />
                                            <FontAwesomeIcon icon={faAngleDown} className="scale-icon" onClick={() => {
                                                if (Number(appointmentEndMinutes) - minutesPerGap >= 0) setAppointmentEndMinutes(value => Number(value) - minutesPerGap);
                                                else if (Number(appointmentEndHour) > startHour) {
                                                    setAppointmentEndHour(currHour => Number(currHour) - 1);
                                                    setAppointmentEndMinutes(60 - minutesPerGap);
                                                }
                                            }} />
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>

                            <div className="label">
                                <p>{cookies.language === "en" ? "Cost" : "Cost"}</p>
                                <div className="appointment-input">
                                    <div className="scale scale-left" onClick={() => setAppointmentCost(currValue => Number(currValue) - 1)}>
                                        <FontAwesomeIcon icon={faMinus} className="scale-icon" />
                                    </div>
                                    <input type="number" className="number-input" value={appointmentCost} onChange={e => setAppointmentCost(e.target.value)} placeholder={cookies.language === "en" ? "Cost" : "Cost"} />
                                    <div className="scale scale-right" onClick={() => setAppointmentCost(currValue => Number(currValue) + 1)}>
                                        <FontAwesomeIcon icon={faPlus} className="scale-icon" />
                                    </div>
                                </div>
                            </div>

                            {/* <div className="label" style={{ opacity: 0 }}>
                                <p>{cookies.language === "en" ? "Type of income" : "Moneda"}</p>
                                <select value={appointmentTypeIncome} onChange={e => setAppointmentTypeIncome(e.target.value)}>
                                    <option value="LEI">LEI</option>
                                </select>
                            </div> */}

                            {appointmentDateValue && <div className="label">
                                <p>{cookies.language === "en" ? "Date" : "Data"}</p>
                                <input type="date" value={new Date(appointmentDateValue).toISOString().substring(0, 10)} onChange={e => setAppointmentDateValue(e.target.value)}/>
                            </div>}

                            <div className="label one-row">
                                <p>{cookies.language === "en" ? "Notes" : "Observatii"}</p>
                                <textarea value={appointmentNotes} onChange={e => setAppointmentNotes(e.target.value)} placeholder={cookies.language === "en" ? "Notes" : "Observatii"} />
                            </div>

                        </div>

                        <button type="button" className="add-appointment" onClick={async () => await sendAppointment()}>
                            <p>{cookies.language === "en" ? "Create appointment" : "Creeaza programarea"}</p>
                        </button>

                    </div>
                </div>


                <div className={`appointment-details ${activeEditAppointment ? "active" : ""}`}>
                    <div className="appointment-details-card">
                        <div className="close-button">
                            <FontAwesomeIcon icon={faTimes} className="close-icon" onClick={() => setActiveEditAppointment(null)} />
                        </div>

                        <h2 className="appointment-details-title">{cookies.language === "en" ? "Edit appointment" : "Editare programare"}</h2>
                    
                        <div className="appointment-details">

                            <div className="label one-row">
                                <p>{cookies.languge === "en" ? "Title" : "Titlu"}</p>
                                <input type="text" value={appointmentTitle} onChange={e => setAppointmentTitle(e.target.value)} placeholder={cookies.language === "en" ? "Title" : "Titlu"} className="row" />
                            </div>
                            
                            <div className="label one-row">
                                <p>{cookies.language === "en" ? "Patient" : "Pacient"}</p>
                                <input type="text" value={appointmentPatient} onChange={e => setAppointmentPatient(e.target.value)} placeholder={cookies.language === "en" ? "Patient" : "Pacient"} />
                                {appointmentPatientsList && appointmentPatientsList.length > 0 && 
                                    <div className="patient-list">
                                        {appointmentPatientsList.map((patient, idx) => (
                                            <div className="patient-container" onClick={() => {
                                                setAppointmentPatient(`${patient.firstname} ${patient.lastname}`);
                                                setAppointmentPatientsList([]);
                                            }}>
                                                <p>{patient.firstname} {patient.lastname} {patient.fileNumber || idx + 1}</p>
                                            </div>
                                        ))}
                                    </div>
                                }
                            </div>

                            <div className="label">
                                <p>{cookies.language === "en" ? "Start Hour" : "Ora inceput"}</p>
                                <div className="label-row">
                                    <div className="input">
                                        <input type="number" onChange={e => setAppointmentStartHour(e.target.value)} placeholder={cookies.language === "en" ? "Hour" : "Ora"} value={appointmentStartHour} />
                                        <div className="scale">
                                            <FontAwesomeIcon icon={faAngleUp} className="scale-icon" onClick={() => appointmentStartHour + 1 <= endHour && setAppointmentStartHour(value => value + 1)} />
                                            <FontAwesomeIcon icon={faAngleDown} className="scale-icon" onClick={() => appointmentStartHour - 1 >= startHour && setAppointmentStartHour(value => value - 1)} />
                                        </div>

                                    </div>
                                    <div className="input">
                                        <input type="number" value={appointmentStartMinutes} onChange={e => setAppointmentStartMinutes(e.target.value)} placeholder={cookies.language === "en" ? "Minutes" : "Minute"}  />
                                        <div className="scale">
                                            <FontAwesomeIcon icon={faAngleUp} className="scale-icon" onClick={() => appointmentStartMinutes + minutesPerGap < 60 && setAppointmentStartMinutes(value => value + minutesPerGap)} />
                                            <FontAwesomeIcon icon={faAngleDown} className="scale-icon" onClick={() => appointmentStartMinutes - minutesPerGap >= 0 && setAppointmentStartMinutes(value => value - minutesPerGap)} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="label">
                                <p>{cookies.language === "en" ? "End Hour" : "Ora sfarsit"}</p>
                                <div className="label-row">
                                    <div className="input">
                                        <input type="number" placeholder={cookies.language === "en" ? "Hour" : "Ora"} value={appointmentEndHour} onChange={e => setAppointmentEndHour(e.target.value)} />
                                        <div className="scale">
                                            <FontAwesomeIcon icon={faAngleUp} className="scale-icon" onClick={() => appointmentEndHour + 1 <= endHour && setAppointmentEndHour(value => value + 1)} />
                                            <FontAwesomeIcon icon={faAngleDown} className="scale-icon" onClick={() => appointmentEndHour - 1 >= startHour && setAppointmentEndHour(value => value - 1)} />
                                        </div>
                                    </div>
                                    <div className="input">
                                        <input type="number" placeholder={cookies.language === "en" ? "Minutes" : "Minute"} value={appointmentEndMinutes} onChange={e => setAppointmentEndMinutes(e.target.value)} />
                                        <div className="scale">
                                            <FontAwesomeIcon icon={faAngleUp} className="scale-icon" onClick={() => appointmentEndMinutes + minutesPerGap < 60 && setAppointmentEndMinutes(value => value + minutesPerGap)} />
                                            <FontAwesomeIcon icon={faAngleDown} className="scale-icon" onClick={() => appointmentEndMinutes - minutesPerGap >= 0 && setAppointmentEndMinutes(value => value - minutesPerGap)}/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="label">
                                <p>{cookies.language === "en" ? "Cost" : "Cost"}</p>
                                
                                <div className="appointment-input">
                                    <div className="scale scale-left" onClick={() => setAppointmentCost(currValue => currValue - 1)}>
                                        <FontAwesomeIcon icon={faMinus} className="scale-icon" />
                                    </div>
                                    <input type="number" className="number-input" value={appointmentCost} onChange={e => setAppointmentCost(e.target.value)} placeholder={cookies.language === "en" ? "Cost" : "Cost"} />
                                    <div className="scale scale-right" onClick={() => setAppointmentCost(currValue => currValue + 1)}>
                                        <FontAwesomeIcon icon={faPlus} className="scale-icon" />
                                    </div>
                                </div>
                            </div>

                            <div className="label" style={{ opacity: 0 }}>
                                <p>{cookies.language === "en" ? "Type of income" : "Moneda"}</p>
                                <select value={appointmentTypeIncome} onChange={e => setAppointmentTypeIncome(e.target.value)}>
                                    <option value="LEI">LEI</option>
                                </select>
                            </div>

                            <div className="label one-row">
                                <p>{cookies.language === "en" ? "Notes" : "Observatii"}</p>
                                <textarea value={appointmentNotes} onChange={e => setAppointmentNotes(e.target.value)} placeholder={cookies.language === "en" ? "Notes" : "Observatii"} />
                            </div>

                            <div className="label">
                                <button className="option-btn" onClick={async () => await removeAppointment(appointmentId)}>
                                    <FontAwesomeIcon icon={faTimes} className="option-icon" />
                                    <p>{cookies.language === "en" ? "Remove appointment" : "Sterge"}</p>
                                </button>
                            </div>

                            <div className="label">
                                <button className="option-btn">
                                    <FontAwesomeIcon icon={faBan} className="option-icon" />
                                    <p>{cookies.language === "en" ? "Cancel appointment" : "Anuleaza"}</p>
                                </button>
                            </div>

                        </div>

                        <button type="button" className="add-appointment" onClick={async () => await editAppointment(appointmentId)}>
                            <p>{cookies.language === "en" ? "Save changes" : "Salveaza modificarile"}</p>
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Appointments;