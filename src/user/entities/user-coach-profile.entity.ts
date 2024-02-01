import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { Column, Entity, OneToOne } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity("user_coach_profiles")
export class UserCoachProfileEntity extends AbstractEntity {
  @Column({ type: "text" })
  title: string;

  @Column({ type: "uuid" })
  userId: string;

  // Personal Trainer/Fitness Professional
  // Nutritionist
  // Health Coach
  // Registered Dietitian (RD, RDN)
  // Physician
  // Naturopath
  // Chiropractor
  // Physiotherapist/Physical Therapist
  // Kinesiologist
  // Nurse Practitioner (NP) or Physician’s Assistant (PA)
  // Nurse (RN)
  // Researcher
  // Student
  // Family
  // Other (please specify)
}
