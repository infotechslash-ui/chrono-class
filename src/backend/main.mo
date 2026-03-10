import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Text "mo:core/Text";
import Nat "mo:core/Nat";

actor {
  module TimetableEntry {
    public func compare(entry1 : TimetableEntry, entry2 : TimetableEntry) : Order.Order {
      Nat.compare(entry1.id, entry2.id);
    };
  };

  module Room {
    public func compare(room1 : Room, room2 : Room) : Order.Order {
      switch (Text.compare(room1.name, room2.name)) {
        case (#equal) { Nat.compare(room1.id, room2.id) };
        case (order) { order };
      };
    };
  };

  module Course {
    public func compare(course1 : Course, course2 : Course) : Order.Order {
      switch (Text.compare(course1.name, course2.name)) {
        case (#equal) { Nat.compare(course1.id, course2.id) };
        case (order) { order };
      };
    };

    public func compareByCode(course1 : Course, course2 : Course) : Order.Order {
      Nat.compare(course1.id, course2.id);
    };
  };

  module Department {
    public func compare(dept1 : Department, dept2 : Department) : Order.Order {
      switch (Text.compare(dept1.name, dept2.name)) {
        case (#equal) { Nat.compare(dept1.id, dept2.id) };
        case (order) { order };
      };
    };
  };

  type Department = {
    id : Nat;
    name : Text;
    hodUserId : ?Principal;
  };

  type RoomType = { #lecture; #lab; #seminar };

  type Room = {
    id : Nat;
    name : Text;
    capacity : Nat;
    roomType : RoomType;
  };

  type Course = {
    id : Nat;
    name : Text;
    code : Text;
    departmentId : Nat;
    teacherId : ?Principal;
    weeklyHours : Nat;
    color : Text;
  };

  type Day = { #mon; #tue; #wed; #thu; #fri; #sat };

  type Period = {
    #p1;
    #p2;
    #p3;
    #p4;
    #p5;
    #p6;
    #p7;
    #p8;
  };

  type TimetableEntry = {
    id : Nat;
    day : Day;
    period : Period;
    courseId : Nat;
    teacherId : ?Principal;
    roomId : Nat;
    departmentId : Nat;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    role : Text;
    departmentId : ?Nat;
  };

  let departments = Map.empty<Nat, Department>();
  let courses = Map.empty<Nat, Course>();
  let rooms = Map.empty<Nat, Room>();
  let timetableEntries = Map.empty<Nat, TimetableEntry>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextDepartmentId = 1;
  var nextCourseId = 1;
  var nextRoomId = 1;
  var nextTimetableEntryId = 1;

  public type CreateDepartmentRequest = {
    name : Text;
    hodUserId : ?Principal;
  };

  public type CreateRoomRequest = {
    name : Text;
    capacity : Nat;
    roomType : RoomType;
  };

  public type CreateCourseRequest = {
    name : Text;
    code : Text;
    departmentId : Nat;
    weeklyHours : Nat;
    color : Text;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Helper function to check if caller is HOD of a department
  func isHodOfDepartment(caller : Principal, departmentId : Nat) : Bool {
    switch (departments.get(departmentId)) {
      case (null) { false };
      case (?dept) {
        switch (dept.hodUserId) {
          case (null) { false };
          case (?hodId) { hodId == caller };
        };
      };
    };
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Department Management
  public shared ({ caller }) func createDepartment(request : CreateDepartmentRequest) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admins only");
    };
    let newDepartment : Department = {
      id = nextDepartmentId;
      name = request.name;
      hodUserId = request.hodUserId;
    };
    departments.add(nextDepartmentId, newDepartment);
    nextDepartmentId += 1;
  };

  public query ({ caller }) func getAllDepartments() : async [Department] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view departments");
    };
    departments.values().toArray().sort();
  };

  // Room Management
  public shared ({ caller }) func createRoom(request : CreateRoomRequest) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admins only");
    };
    let newRoom : Room = {
      id = nextRoomId;
      name = request.name;
      capacity = request.capacity;
      roomType = request.roomType;
    };
    rooms.add(nextRoomId, newRoom);
    nextRoomId += 1;
  };

  public query ({ caller }) func getAllRooms() : async [Room] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view rooms");
    };
    rooms.values().toArray().sort();
  };

  // Course Management
  public shared ({ caller }) func createCourse(request : CreateCourseRequest) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admins only");
    };
    let newCourse : Course = {
      id = nextCourseId;
      name = request.name;
      code = request.code;
      departmentId = request.departmentId;
      teacherId = null;
      weeklyHours = request.weeklyHours;
      color = request.color;
    };
    courses.add(nextCourseId, newCourse);
    nextCourseId += 1;
  };

  public shared ({ caller }) func assignTeacherToCourse(courseId : Nat, teacherId : Principal) : async () {
    let course = switch (courses.get(courseId)) {
      case (null) { Runtime.trap("Course not found") };
      case (?c) { c };
    };
    
    // Admin or HOD of the course's department can assign teachers
    if (not (AccessControl.isAdmin(accessControlState, caller)) and not (isHodOfDepartment(caller, course.departmentId))) {
      Runtime.trap("Unauthorized: Only admins or HOD of the department can assign teachers");
    };

    let updatedCourse : Course = {
      id = course.id;
      name = course.name;
      code = course.code;
      departmentId = course.departmentId;
      teacherId = ?teacherId;
      weeklyHours = course.weeklyHours;
      color = course.color;
    };
    courses.add(courseId, updatedCourse);
  };

  public query ({ caller }) func getCoursesByDepartment(departmentId : Nat) : async [Course] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view courses");
    };
    courses.values().toArray().filter(
      func(course) {
        course.departmentId == departmentId;
      }
    ).sort();
  };

  public query ({ caller }) func getCoursesByTeacher(teacherId : Principal) : async [Course] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view courses");
    };
    
    // Only the teacher themselves or an admin can view a teacher's courses
    if (caller != teacherId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own courses");
    };

    courses.values().toArray().filter(
      func(course) {
        switch (course.teacherId) {
          case (null) { false };
          case (?tid) { tid == teacherId };
        };
      }
    ).sort<Course>(Course.compareByCode);
  };

  // Timetable Management
  public query ({ caller }) func getTimetableByDepartment(departmentId : Nat) : async [TimetableEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view timetables");
    };
    timetableEntries.values().toArray().filter(
      func(entry) {
        entry.departmentId == departmentId;
      }
    ).sort();
  };

  public query ({ caller }) func getTimetableByTeacher(teacherId : Principal) : async [TimetableEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view timetables");
    };
    
    // Only the teacher themselves or an admin can view a teacher's timetable
    if (caller != teacherId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own timetable");
    };

    timetableEntries.values().toArray().filter(
      func(entry) {
        switch (entry.teacherId) {
          case (null) { false };
          case (?tid) { tid == teacherId };
        };
      }
    ).sort();
  };
};
