const supabase = require("../config/supabase");

const mapUser = (user) => {
  if (!user) return null;

  return {
    ...user,
    _id: user.id,
    isAdmin: user.is_admin,
    isDoctor: user.is_doctor,
    phone: user.phone || null,
    notifcation: user.notification || [],
    seennotification: user.seen_notification || [],
  };
};

class UserModel {
  constructor(data) {
    this._id = data._id || data.id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.phone = data.phone || null;
    this.isAdmin = data.isAdmin ?? data.is_admin ?? false;
    this.isDoctor = data.isDoctor ?? data.is_doctor ?? false;
    this.notifcation = data.notifcation ?? data.notification ?? [];
    this.seennotification =
      data.seennotification ?? data.seen_notification ?? [];
  }

  async save() {
    const userData = {
      name: this.name,
      email: this.email,
      password: this.password,
      phone: this.phone,
      is_admin: this.isAdmin,
      is_doctor: this.isDoctor,
      notification: this.notifcation,
      seen_notification: this.seennotification,
    };

    let result;

    if (this._id) {
      result = await supabase
        .from("users")
        .update(userData)
        .eq("id", this._id)
        .select()
        .single();
    } else {
      result = await supabase.from("users").insert(userData).select().single();
    }

    if (result.error) {
      throw result.error;
    }

    const user = mapUser(result.data);

    this._id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
    this.isAdmin = user.isAdmin;
    this.isDoctor = user.isDoctor;
    this.notifcation = user.notifcation;
    this.seennotification = user.seennotification;

    return this;
  }

  static async findOne(query) {
    let request = supabase.from("users").select("*");

    if (query.email) {
      request = request.eq("email", query.email);
    }

    if (query.isAdmin !== undefined) {
      request = request.eq("is_admin", query.isAdmin);
    }

    if (query._id) {
      request = request.eq("id", query._id);
    }

    const { data, error } = await request.limit(1).maybeSingle();

    if (error) {
      throw error;
    }

    return mapUser(data);
  }

  static async findById(query) {
    const id = typeof query === "object" ? query._id : query;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return mapUser(data);
  }

  static async findByIdAndUpdate(id, update) {
    const userData = {};

    if (update.name !== undefined) userData.name = update.name;
    if (update.email !== undefined) userData.email = update.email;
    if (update.password !== undefined) userData.password = update.password;
    if (update.phone !== undefined) userData.phone = update.phone;
    if (update.isAdmin !== undefined) userData.is_admin = update.isAdmin;
    if (update.isDoctor !== undefined) userData.is_doctor = update.isDoctor;
    if (update.notifcation !== undefined) {
      userData.notification = update.notifcation;
    }
    if (update.seennotification !== undefined) {
      userData.seen_notification = update.seennotification;
    }

    const { data, error } = await supabase
      .from("users")
      .update(userData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return mapUser(data);
  }

  static async find(query = {}) {
    let request = supabase.from("users").select("*");

    if (query.email) {
      request = request.eq("email", query.email);
    }

    if (query.isAdmin !== undefined) {
      request = request.eq("is_admin", query.isAdmin);
    }

    if (query.isDoctor !== undefined) {
      request = request.eq("is_doctor", query.isDoctor);
    }

    const { data, error } = await request;

    if (error) {
      throw error;
    }

    return data.map(mapUser);
  }
}

module.exports = UserModel;
