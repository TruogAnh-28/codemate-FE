import { Document } from './../types/Document';

export const documentData: Document = {
    id: "module-type-compatibility-java",
    name: "Check for Type Compatibility in Java",
    theoryContent: [
      {
        title: "What is Type Compatibility?",
        prerequisites: ["Understanding of Data Types in Java", "Basic Java Syntax"],
        description: [
          "Type compatibility in Java refers to the ability of one type to be assigned to another type while maintaining type safety and avoiding compile-time errors. It is an essential aspect of Java's static type-checking mechanism.",
          "Java enforces type compatibility through a combination of implicit type conversions (automatic type promotion) and explicit type conversions (casting). These ensure that type mismatches are caught at compile-time, reducing runtime errors.",
          "Type compatibility is closely related to inheritance and polymorphism. For example, a subclass is always type-compatible with its superclass, which is the foundation of Java's upcasting behavior.",
          "The two main categories of type compatibility in Java are:",
          "1. Primitive Type Compatibility: This involves implicit promotions (e.g., int to float) and explicit casting (e.g., float to int).",
          "2. Reference Type Compatibility: This is based on Java's object-oriented principles, including inheritance, polymorphism, and interfaces. For instance, an object reference of a parent type can hold a reference to a child object (upcasting).",
          "Understanding type compatibility helps developers avoid common errors such as type mismatch, loss of precision in numeric conversions, and runtime exceptions during invalid type casts."
        ],
        examples: [
          {
            title: "Basic Example of Type Compatibility",
            codeSnippet: `
  class Animal {
      String name;
  }
  
  class Dog extends Animal {
      String breed;
  }
  
  public class Main {
      public static void main(String[] args) {
          Dog dog = new Dog();
          dog.name = "Rex";
          dog.breed = "Golden Retriever";
          
          Animal animal = dog; // Valid because Dog is a subclass of Animal.
          System.out.println(animal.name); // Outputs: Rex
      }
  }
            `,
            explanation: "Here, the `Dog` object is compatible with the `Animal` type because `Dog` is a subclass of `Animal`. This relationship is fundamental to Java's inheritance model and supports polymorphic behavior."
          },
        ],
      },
      {
        title: "Type Casting in Java",
        prerequisites: ["Understanding of Inheritance in Java", "Concept of Object Class"],
        description: [
          "Type casting in Java allows you to convert a variable from one type to another. It is often used in scenarios involving inheritance and polymorphism to access specific behaviors of an object.",
          "There are two types of casting in Java:",
          "1. Upcasting: This is an implicit conversion where a subclass object is assigned to a superclass reference. It allows generalized handling of objects, enabling polymorphism. For example, assigning a `Dog` object to an `Animal` reference.",
          "2. Downcasting: This is an explicit conversion where a superclass reference is cast back to its subclass. This is required to access subclass-specific members and must be done with caution, as invalid downcasting results in a `ClassCastException` at runtime.",
          "Casting is particularly useful in scenarios involving collections, dynamic method invocation, or frameworks like Java Reflection where object types are not explicitly known at compile time.",
          "Java also provides runtime checks (via the `instanceof` operator) to ensure safe downcasting and prevent potential runtime exceptions."
        ],
        examples: [
          {
            title: "Upcasting and Downcasting Example",
            codeSnippet: `
  class Animal {
      void sound() {
          System.out.println("Animal makes a sound");
      }
  }
  
  class Dog extends Animal {
      void sound() {
          System.out.println("Dog barks");
      }
      void fetch() {
          System.out.println("Dog fetches the ball");
      }
  }
  
  public class Main {
      public static void main(String[] args) {
          Animal animal = new Dog(); // Upcasting (Implicit)
          animal.sound(); // Outputs: Dog barks
          
          Dog dog = (Dog) animal; // Downcasting (Explicit)
          dog.fetch(); // Outputs: Dog fetches the ball
      }
  }
            `,
            explanation: "In this example, upcasting simplifies the handling of objects with generalized references, while downcasting restores access to `Dog`-specific methods. Care should be taken during downcasting to ensure the object is actually of the target type."
          },
        ],
      },
    ],
    practicalGuide: [
      {
        title: "Practical Steps for Checking Type Compatibility",
        steps: [
          "Define a parent class and a child class with additional methods or fields.",
          "Perform upcasting by assigning a child class object to a parent class reference.",
          "Try downcasting the parent class reference back to the child class type.",
          "Observe compile-time or runtime errors when type compatibility fails.",
        ],
        commonErrors: [
          "Performing invalid downcasting without proper type checks, leading to `ClassCastException`.",
          "Misunderstanding type compatibility in non-inheritance hierarchies.",
        ],
      },
    ],
    references: [
      {
        title: "Java Documentation: Type Casting and Compatibility",
        link: "https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html",
        description: "Official Java documentation on type casting and compatibility in inheritance.",
      },
      {
        title: "Understanding Upcasting and Downcasting in Java",
        link: "https://www.geeksforgeeks.org/upcasting-and-downcasting-in-java/",
        description: "A comprehensive guide to upcasting and downcasting with examples.",
      },
    ],
    summaryAndReview: {
      keyPoints: [
        "Type compatibility in Java is influenced by inheritance and the object type hierarchy.",
        "Upcasting is implicit, but downcasting requires explicit casting.",
        "Invalid downcasting can cause a runtime `ClassCastException`.",
      ],
      reviewQuestions: [
        "What is the difference between upcasting and downcasting in Java?",
        "Why is the following code valid?\n```java\nclass Animal {}\nclass Cat extends Animal {}\nAnimal animal = new Cat();\nCat cat = (Cat) animal;\n```",
        "What happens if you try to cast an object to an unrelated type?",
      ],
      quizLink: "https://example.com/java-type-compatibility-quiz",
    },
  };
  