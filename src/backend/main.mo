import Map "mo:core/Map";
import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  /// Types

  type Vegetable = {
    id : Nat;
    name : Text;
    price : Float;
    description : Text;
    category : Text;
    stockAvailable : Bool;
    image : ?Storage.ExternalBlob;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    address : Text;
  };

  module Vegetable {
    public func compareByPrice(a : Vegetable, b : Vegetable) : Order.Order {
      switch (Float.compare(a.price, b.price)) {
        case (#equal) { Nat.compare(a.id, b.id) };
        case (order) { order };
      };
    };
  };

  /// State

  // Incremental ID generator for vegetables
  var nextVegetableId = 1;

  // Vegetable Catalog Storage
  let vegetableCatalog = Map.empty<Nat, Vegetable>();

  // User Profiles Storage
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Initialization
  var isInitialized = false;

  // Seed Data [Non-Async]
  func seedVegetablesIfNeeded() {
    if (isInitialized) { return };
    addSeedVegetable("Spinach", 2.99, "Leafy green rich in iron", "Leafy Greens", true);
    addSeedVegetable("Carrots", 1.49, "Crunchy orange root vegetable", "Root Vegetables", true);
    addSeedVegetable("Tomatoes", 2.19, "Juicy red fruit vegetable", "Fruiting Vegetables", true);
    addSeedVegetable("Broccoli", 2.79, "Cruciferous veggie high in fiber", "Brassicas", true);
    addSeedVegetable("Lettuce", 1.99, "Leafy green for salads", "Leafy Greens", true);
    addSeedVegetable("Potatoes", 0.99, "Versatile root vegetable", "Root Vegetables", true);
    addSeedVegetable("Cucumbers", 1.69, "Refreshingly crunchy", "Fruiting Vegetables", true);
    addSeedVegetable("Cauliflower", 2.59, "Low carb alternative", "Brassicas", true);
    addSeedVegetable("Beetroot", 1.89, "Earthy sweet root", "Root Vegetables", true);
    addSeedVegetable("Kale", 2.49, "Nutrient-rich leafy green", "Leafy Greens", true);
    isInitialized := true;
  };

  func addSeedVegetable(name : Text, price : Float, description : Text, category : Text, stockAvailable : Bool) {
    let id = nextVegetableId;
    nextVegetableId += 1;

    let vegetable : Vegetable = {
      id;
      name;
      price;
      description;
      category;
      stockAvailable;
      image = null;
    };

    vegetableCatalog.add(id, vegetable);
  };

  /// Public Interface - User Profile Management

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
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

  /// Public Interface - Vegetable Catalog

  // Vegetable Queries (accessible to all including guests)
  public query ({ caller }) func getAllVegetables() : async [Vegetable] {
    seedVegetablesIfNeeded();
    vegetableCatalog.values().toArray().sort(Vegetable.compareByPrice);
  };

  public query ({ caller }) func getVegetable(id : Nat) : async Vegetable {
    switch (vegetableCatalog.get(id)) {
      case (null) { Runtime.trap("Vegetable not found") };
      case (?vegetable) { vegetable };
    };
  };

  public query ({ caller }) func getVegetablesByCategory(category : Text) : async [Vegetable] {
    seedVegetablesIfNeeded();
    vegetableCatalog.values().toArray().filter(
      func(vegetable) {
        vegetable.category.contains(#text category);
      }
    );
  };

  // Admin Mutations (require admin authorization)
  public shared ({ caller }) func createVegetable(name : Text, price : Float, description : Text, category : Text, stockAvailable : Bool, image : ?Storage.ExternalBlob) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can create vegetables");
    };
    let id = nextVegetableId;
    nextVegetableId += 1;

    let vegetable : Vegetable = {
      id;
      name;
      price;
      description;
      category;
      stockAvailable;
      image;
    };

    vegetableCatalog.add(id, vegetable);
    id;
  };

  public shared ({ caller }) func updateVegetable(id : Nat, name : Text, price : Float, description : Text, category : Text, stockAvailable : Bool, image : ?Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can update vegetables");
    };
    switch (vegetableCatalog.get(id)) {
      case (null) { Runtime.trap("Vegetable not found") };
      case (?_) {
        let updatedVegetable : Vegetable = {
          id;
          name;
          price;
          description;
          category;
          stockAvailable;
          image;
        };
        vegetableCatalog.add(id, updatedVegetable);
      };
    };
  };

  public shared ({ caller }) func deleteVegetable(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can delete vegetables");
    };
    switch (vegetableCatalog.get(id)) {
      case (null) { Runtime.trap("Vegetable not found") };
      case (?_) {
        vegetableCatalog.remove(id);
      };
    };
  };
};
