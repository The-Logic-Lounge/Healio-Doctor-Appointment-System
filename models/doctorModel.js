const supabase = require("../config/supabase");

const mapDoctor = (doctor) => {
  if (!doctor) return null;

  return {
    ...doctor,
    _id: doctor.id,
    userId: doctor.user_id,
    firstName: doctor.first_name,
    lastName: doctor.last_name,
    feesPerCunsaltation: doctor.fees_per_consultation,
  };
};

class DoctorModel {
  constructor(data) {
    this._id = data._id || data.id;
    this.userId = data.userId ?? data.user_id;
    this.firstName = data.firstName ?? data.first_name;
    this.lastName = data.lastName ?? data.last_name;
    this.phone = data.phone;
    this.email = data.email;
    this.website = data.website;
    this.address = data.address;
    this.specialization = data.specialization;
    this.experience = data.experience;
    this.feesPerCunsaltation =
      data.feesPerCunsaltation ?? data.fees_per_consultation;
    this.status = data.status ?? "pending";
    this.timings = data.timings;
  }

  async save() {
    const doctorData = {
      user_id: this.userId,
      first_name: this.firstName,
      last_name: this.lastName,
      phone: this.phone,
      email: this.email,
      website: this.website,
      address: this.address,
      specialization: this.specialization,
      experience: this.experience,
      fees_per_consultation: this.feesPerCunsaltation,
      status: this.status,
      timings: this.timings,
    };

    let result;

    if (this._id) {
      result = await supabase
        .from("doctor")
        .update(doctorData)
        .eq("id", this._id)
        .select()
        .single();
    } else {
      result = await supabase
        .from("doctor")
        .insert(doctorData)
        .select()
        .single();
    }

    if (result.error) {
      throw result.error;
    }

    Object.assign(this, new DoctorModel(result.data));

    return this;
  }

  static async findOne(query = {}) {
    let request = supabase.from("doctor").select("*");

    if (query.userId !== undefined) {
      request = request.eq("user_id", query.userId);
    }

    if (query._id !== undefined) {
      request = request.eq("id", query._id);
    }

    if (query.email !== undefined) {
      request = request.eq("email", query.email);
    }

    const { data, error } = await request.limit(1).maybeSingle();

    if (error) {
      throw error;
    }

    return mapDoctor(data);
  }

  static async find(query = {}) {
    let request = supabase.from("doctor").select("*");

    if (query.userId !== undefined) {
      request = request.eq("user_id", query.userId);
    }

    if (query._id !== undefined) {
      request = request.eq("id", query._id);
    }

    if (query.status !== undefined) {
      request = request.eq("status", query.status);
    }

    const { data, error } = await request;

    if (error) {
      throw error;
    }

    return (data || []).map(mapDoctor);
  }

  static async findByIdAndUpdate(id, update) {
    const doctorData = {};

    if (update.userId !== undefined) doctorData.user_id = update.userId;
    if (update.firstName !== undefined)
      doctorData.first_name = update.firstName;
    if (update.lastName !== undefined) doctorData.last_name = update.lastName;
    if (update.phone !== undefined) doctorData.phone = update.phone;
    if (update.email !== undefined) doctorData.email = update.email;
    if (update.website !== undefined) doctorData.website = update.website;
    if (update.address !== undefined) doctorData.address = update.address;
    if (update.specialization !== undefined)
      doctorData.specialization = update.specialization;
    if (update.experience !== undefined)
      doctorData.experience = update.experience;
    if (update.feesPerCunsaltation !== undefined) {
      doctorData.fees_per_consultation = update.feesPerCunsaltation;
    }
    if (update.status !== undefined) doctorData.status = update.status;
    if (update.timings !== undefined) doctorData.timings = update.timings;

    const { data, error } = await supabase
      .from("doctor")
      .update(doctorData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return mapDoctor(data);
  }

  static async findOneAndUpdate(query, update) {
    const doctor = await this.findOne(query);

    if (!doctor) {
      return null;
    }

    return this.findByIdAndUpdate(doctor._id, update);
  }
}

module.exports = DoctorModel;
