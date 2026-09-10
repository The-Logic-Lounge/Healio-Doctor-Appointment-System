// Seeds demo data for Supabase
// Run: npm run seed

require("dotenv").config();

const bcrypt = require("bcryptjs");
const moment = require("moment");
const supabase = require("./config/supabase");

const hash = (p) => bcrypt.hashSync(p, 10);
const PW = "123456";

const run = async () => {
  try {
    // Clear existing data
    const { error: appointmentDeleteError } = await supabase
      .from("appointments")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    if (appointmentDeleteError) throw appointmentDeleteError;

    const { error: doctorDeleteError } = await supabase
      .from("doctor")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    if (doctorDeleteError) throw doctorDeleteError;

    const { error: userDeleteError } = await supabase
      .from("users")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    if (userDeleteError) throw userDeleteError;

    // ADMIN
    const { data: admin, error: adminError } = await supabase
      .from("users")
      .insert({
        name: "Ayesha Khan",
        email: "admin@medbook.test",
        password: hash(PW),
        is_admin: true,
        is_doctor: false,
      })
      .select()
      .single();

    if (adminError) throw adminError;

    // DOCTORS
    const docSeed = [
      {
        n: "Bilal",
        l: "Ahmed",
        s: "Cardiologist",
        f: 3000,
        e: "12 years",
        a: "Clifton, Karachi",
      },
      {
        n: "Sana",
        l: "Malik",
        s: "Dermatologist",
        f: 2500,
        e: "8 years",
        a: "Gulshan, Karachi",
      },
      {
        n: "Imran",
        l: "Qureshi",
        s: "Neurologist",
        f: 4000,
        e: "15 years",
        a: "DHA, Karachi",
      },
      {
        n: "Hina",
        l: "Raza",
        s: "Pediatrician",
        f: 2000,
        e: "6 years",
        a: "North Nazimabad, Karachi",
      },
    ];

    const doctors = [];

    for (const d of docSeed) {
      const email = `${d.n.toLowerCase()}.${d.l.toLowerCase()}@medbook.test`;

      const { data: user, error: userError } = await supabase
        .from("users")
        .insert({
          name: `Dr. ${d.n} ${d.l}`,
          email,
          password: hash(PW),
          is_admin: false,
          is_doctor: true,
        })
        .select()
        .single();

      if (userError) throw userError;

      const { data: doctor, error: doctorError } = await supabase
        .from("doctor")
        .insert({
          user_id: user.id,
          first_name: d.n,
          last_name: d.l,
          phone: "03001234567",
          email: user.email,
          address: d.a,
          website: "https://medbook.test",
          specialization: d.s,
          experience: d.e,
          fees_per_consultation: d.f,
          status: "approved",
          timings: ["09:00", "17:00"],
        })
        .select()
        .single();

      if (doctorError) throw doctorError;

      doctors.push({ user, doctor });
    }

    // PATIENTS
    const patients = [];

    for (const name of ["Omar Farooq", "Zainab Ali", "Hassan Raza"]) {
      const firstName = name.split(" ")[0].toLowerCase();

      const { data: patient, error: patientError } = await supabase
        .from("users")
        .insert({
          name,
          email: `${firstName}@medbook.test`,
          password: hash(PW),
          is_admin: false,
          is_doctor: false,
        })
        .select()
        .single();

      if (patientError) throw patientError;

      patients.push(patient);
    }

    // APPOINTMENTS
    const createAppointment = async (
      patient,
      doctor,
      dayOffset,
      time,
      status,
    ) => {
      const { error } = await supabase.from("appointments").insert({
        user_id: patient.id,
        doctor_id: doctor.doctor.id,
        doctor_info: {
          id: doctor.doctor.id,
          firstName: doctor.doctor.first_name,
          lastName: doctor.doctor.last_name,
          email: doctor.doctor.email,
        },
        user_info: {
          id: patient.id,
          name: patient.name,
          email: patient.email,
        },
        date: moment().add(dayOffset, "days").format("DD-MM-YYYY"),
        time,
        status,
      });

      if (error) throw error;
    };

    await createAppointment(patients[0], doctors[0], 1, "10:00", "pending");

    await createAppointment(patients[0], doctors[1], -3, "11:30", "approved");

    await createAppointment(patients[1], doctors[2], 2, "14:00", "approved");

    await createAppointment(patients[2], doctors[3], 5, "09:30", "pending");

    await createAppointment(patients[1], doctors[0], -7, "16:00", "approved");

    // PENDING DOCTOR
    const { data: pendingUser, error: pendingUserError } = await supabase
      .from("users")
      .insert({
        name: "Dr. Nadia Sheikh",
        email: "nadia.sheikh@medbook.test",
        password: hash(PW),
        is_admin: false,
        is_doctor: false,
      })
      .select()
      .single();

    if (pendingUserError) throw pendingUserError;

    const { error: pendingDoctorError } = await supabase.from("doctor").insert({
      user_id: pendingUser.id,
      first_name: "Nadia",
      last_name: "Sheikh",
      phone: "03331112222",
      email: pendingUser.email,
      address: "Saddar, Karachi",
      specialization: "Psychiatrist",
      experience: "9 years",
      fees_per_consultation: 3500,
      status: "pending",
      timings: ["10:00", "16:00"],
    });

    if (pendingDoctorError) throw pendingDoctorError;

    // COUNTS
    const { count: usersCount, error: usersCountError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    if (usersCountError) throw usersCountError;

    const { count: doctorsCount, error: doctorsCountError } = await supabase
      .from("doctor")
      .select("*", { count: "exact", head: true });

    if (doctorsCountError) throw doctorsCountError;

    const { count: appointmentsCount, error: appointmentsCountError } =
      await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true });

    if (appointmentsCountError) throw appointmentsCountError;

    console.log("\n==============================");
    console.log("       SEED SUCCESSFUL");
    console.log("==============================");
    console.log("users:", usersCount);
    console.log("doctors:", doctorsCount);
    console.log("appointments:", appointmentsCount);
    console.log("\nPassword for all users:", PW);
    console.log("admin :", admin.email);
    console.log("doctor:", doctors[0].user.email);
    console.log("patient:", patients[0].email);
    console.log("==============================\n");
  } catch (error) {
    console.error("\nSEED ERROR:");
    console.error(error);
    process.exit(1);
  }
};

run();
