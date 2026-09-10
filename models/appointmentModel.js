const supabase = require("../config/supabase");

const mapAppointment = (appointment) => {
  if (!appointment) return null;

  return {
    ...appointment,
    _id: appointment.id,
    userId: appointment.user_id,
    doctorId: appointment.doctor_id,
    doctorInfo: appointment.doctor_info,
    userInfo: appointment.user_info,
  };
};

class AppointmentModel {
  constructor(data) {
    this._id = data._id || data.id;
    this.userId = data.userId ?? data.user_id;
    this.doctorId = data.doctorId ?? data.doctor_id;
    this.doctorInfo = data.doctorInfo ?? data.doctor_info;
    this.userInfo = data.userInfo ?? data.user_info;
    this.date = data.date;
    this.status = data.status ?? "pending";
    this.time = data.time;
  }

  async save() {
    const appointmentData = {
      user_id: this.userId,
      doctor_id: this.doctorId,
      doctor_info: this.doctorInfo,
      user_info: this.userInfo,
      date: this.date,
      status: this.status,
      time: this.time,
    };

    let result;

    if (this._id) {
      result = await supabase
        .from("appointments")
        .update(appointmentData)
        .eq("id", this._id)
        .select()
        .single();
    } else {
      result = await supabase
        .from("appointments")
        .insert(appointmentData)
        .select()
        .single();
    }

    if (result.error) {
      throw result.error;
    }

    Object.assign(this, new AppointmentModel(result.data));

    return this;
  }

  static async find(query = {}) {
    let request = supabase.from("appointments").select("*");

    if (query.userId !== undefined) {
      request = request.eq("user_id", query.userId);
    }

    if (query.doctorId !== undefined) {
      request = request.eq("doctor_id", query.doctorId);
    }

    if (query.status !== undefined) {
      request = request.eq("status", query.status);
    }

    const { data, error } = await request;

    if (error) {
      throw error;
    }

    return (data || []).map(mapAppointment);
  }

  static async findOne(query = {}) {
    let request = supabase.from("appointments").select("*");

    if (query._id !== undefined) {
      request = request.eq("id", query._id);
    }

    if (query.userId !== undefined) {
      request = request.eq("user_id", query.userId);
    }

    if (query.doctorId !== undefined) {
      request = request.eq("doctor_id", query.doctorId);
    }

    const { data, error } = await request.limit(1).maybeSingle();

    if (error) {
      throw error;
    }

    return mapAppointment(data);
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return mapAppointment(data);
  }

  static async findByIdAndUpdate(id, update) {
    const appointmentData = {};

    if (update.userId !== undefined) {
      appointmentData.user_id = update.userId;
    }

    if (update.doctorId !== undefined) {
      appointmentData.doctor_id = update.doctorId;
    }

    if (update.doctorInfo !== undefined) {
      appointmentData.doctor_info = update.doctorInfo;
    }

    if (update.userInfo !== undefined) {
      appointmentData.user_info = update.userInfo;
    }

    if (update.date !== undefined) {
      appointmentData.date = update.date;
    }

    if (update.status !== undefined) {
      appointmentData.status = update.status;
    }

    if (update.time !== undefined) {
      appointmentData.time = update.time;
    }

    const { data, error } = await supabase
      .from("appointments")
      .update(appointmentData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return mapAppointment(data);
  }
}

module.exports = AppointmentModel;
