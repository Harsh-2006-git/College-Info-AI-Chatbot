import os
import sys
import json
from pathlib import Path

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

backend_dir = Path(__file__).resolve().parent.parent.parent
root_dir = backend_dir.parent
docs_dir = root_dir / "documents" / "documents"
if not docs_dir.exists():
    docs_dir = root_dir / "documents"

def read_doc(*subpaths):
    p = docs_dir.joinpath(*subpaths)
    if p.exists():
        return p.read_text(encoding="utf-8", errors="ignore").strip()
    return ""

def generate_domains():
    kb = {}
    
    # 01 Overview, Vision & Mission
    about = read_doc("About_Institute", "about_mits.txt")
    vision = read_doc("About_Institute", "vision_mission.txt")
    vc_msg = read_doc("About_Institute", "vice_chancellor_message.txt")
    contact = read_doc("contact_us.txt")
    kb["01_overview_vision_mission.txt"] = f"{about}\n\n## Vision & Mission\n{vision}\n\n## Vice Chancellor Message\n{vc_msg}\n\n## Contact Information\n{contact}"

    # 02 Governance & Administration
    chancellor = read_doc("Administration", "chancellor.txt")
    vc = read_doc("Administration", "vice_chancellor.txt")
    pro_vc = read_doc("Administration", "pro_vice_chancellor.txt")
    registrar = read_doc("Administration", "registrar.txt")
    leadership = read_doc("Administration", "academic_leadership.txt")
    deans = read_doc("Administration", "deans.txt")
    exec_council = read_doc("Administration", "executive_council.txt")
    kb["02_governance_and_administration.txt"] = (
        f"# Administration & Governance — MITS Gwalior\n\n"
        f"## Chancellor\n{chancellor}\n\n"
        f"## Vice Chancellor\n{vc}\n\n"
        f"## Pro Vice Chancellor\n{pro_vc}\n\n"
        f"## Registrar\n{registrar}\n\n"
        f"## Academic Leadership\n{leadership}\n\n"
        f"## Deans of MITS\n{deans}\n\n"
        f"## Executive Council\n{exec_council}"
    )

    # 03 Academics, Courses & Curriculum
    ug = read_doc("Academic", "Courses", "under_graduate.txt")
    pg = read_doc("Academic", "Courses", "post_graduate.txt")
    phd = read_doc("Academic", "Courses", "phd.txt")
    kb["03_academics_courses_and_curriculum.txt"] = (
        f"# Academic Programmes & Course Offerings\n\n"
        f"## Under Graduate Programmes (B.Tech & B.Arch)\n{ug}\n\n"
        f"## Post Graduate Programmes (M.Tech, MCA, MBA)\n{pg}\n\n"
        f"## Doctoral Programmes (Ph.D)\n{phd}"
    )

    # 04 Academic Ordinances & Calendars
    ord_text = read_doc("Academic", "ordinances.txt")
    cal_text = read_doc("Academic", "academic_calendar.txt")
    kb["04_academic_calendars_and_regulations.txt"] = (
        f"# Academic Regulations, Ordinances & Calendars\n\n"
        f"## University Ordinances & Revised Download Links\n{ord_text}\n\n"
        f"## Academic Calendar\n{cal_text}"
    )

    # 05 Faculty Directory All Departments
    fac_texts = []
    sc_dir = docs_dir / "Academic" / "School&Centre"
    if sc_dir.exists():
        for dept in sorted(sc_dir.iterdir()):
            if dept.is_dir():
                fac_file = dept / "faculty_profiles.txt"
                if fac_file.exists():
                    dept_name = dept.name.replace("_", " ").title()
                    f_content = fac_file.read_text(encoding="utf-8", errors="ignore").strip()
                    fac_texts.append(f"### {dept_name}\n{f_content}")
    kb["05_faculty_directory_all_departments.txt"] = (
        f"# Faculty Directory — All Departments (MITS Gwalior)\n\n" + "\n\n---\n\n".join(fac_texts)
    )

    # 06 Infrastructure & Campus Facilities
    lrc = read_doc("Student_Life", "Facilities", "learning_resource_centre.txt")
    ws = read_doc("Student_Life", "Facilities", "workshop.txt")
    med = read_doc("Student_Life", "Facilities", "medical_and_dispensary.txt")
    diff = read_doc("Student_Life", "Facilities", "facilities_for_differently_abled.txt")
    guest = read_doc("Student_Life", "Facilities", "guest_house.txt")
    kb["06_infrastructure_campus_and_facilities.txt"] = (
        f"# Campus Infrastructure & Facilities\n\n"
        f"## Learning Resource Centre (Central Library)\n{lrc}\n\n"
        f"## Central Workshop\n{ws}\n\n"
        f"## Medical & Dispensary\n{med}\n\n"
        f"## Facilities for Differently Abled\n{diff}\n\n"
        f"## Guest House\n{guest}"
    )

    # 07 Training & Placements
    pr = read_doc("Training_and_Placement", "placement_records.txt")
    lr = read_doc("Training_and_Placement", "leading_recruiters.txt")
    tp_about = read_doc("Training_and_Placement", "about_tp_cell.txt")
    tp_pol = read_doc("Training_and_Placement", "internship_and_placement_policy.txt")
    kb["07_training_placements_and_internships.txt"] = (
        f"# Training, Placements & Internships\n\n"
        f"{pr}\n\n"
        f"## Leading Recruiters & Company Partners\n{lr}\n\n"
        f"## About Training & Placement Cell\n{tp_about}\n\n"
        f"## Placement Policy & Internship Guidelines\n{tp_pol}"
    )

    # 08 Student Life, Societies & Clubs
    soc = read_doc("Student_Life", "Student_Activities", "societies_and_clubs.txt")
    sdc = read_doc("Student_Life", "Student_Activities", "software_development_club.txt")
    comm = read_doc("Student_Life", "Student_Activities", "commemorative_days.txt")
    sports = read_doc("Student_Life", "Student_Activities", "sports_and_cultural_events.txt")
    ncc = read_doc("Student_Life", "Student_Activities", "ncc.txt")
    nss = read_doc("Student_Life", "Student_Activities", "nss.txt")
    kb["08_student_life_societies_and_clubs.txt"] = (
        f"# Student Life, Societies, Clubs & Activities\n\n"
        f"## Technical & Cultural Societies\n{soc}\n\n"
        f"## Software Development Club (SDC)\n{sdc}\n\n"
        f"## Sports & Cultural Events\n{sports}\n\n"
        f"## Commemorative Days & Celebrations\n{comm}\n\n"
        f"## NCC & NSS\n{ncc}\n\n{nss}"
    )

    # 09 Accreditations, NAAC & Quality Initiatives
    accred = read_doc("About_Institute", "accreditation.txt")
    test_cons = read_doc("R&D", "testing_and_consultancy.txt")
    kb["09_accreditations_and_quality_initiatives.txt"] = (
        f"# Accreditations, Rankings & Quality Assurance\n\n"
        f"{accred}\n\n"
        f"## Testing & Consultancy\n{test_cons}"
    )

    # 10 Admissions & Eligibility
    ug_adm = read_doc("Admission", "ug_admissions.txt")
    pg_adm = read_doc("Admission", "pg_admissions.txt")
    phd_adm = read_doc("Admission", "phd_admission.txt")
    sched = read_doc("Admission", "admission_schedule.txt")
    nri = read_doc("Admission", "nri_admission.txt")
    faqs = read_doc("Admission", "faqs.txt")
    kb["10_admissions_eligibility_and_counselling.txt"] = (
        f"# Admission Procedure, Eligibility & Schedules\n\n"
        f"## Undergraduate Admissions (B.Tech / B.Arch)\n{ug_adm}\n\n"
        f"## Postgraduate Admissions (M.Tech / MCA / MBA)\n{pg_adm}\n\n"
        f"## Ph.D. Admissions\n{phd_adm}\n\n"
        f"## Admission Schedules & Cutoffs\n{sched}\n\n"
        f"## NRI Admissions\n{nri}\n\n"
        f"## Frequently Asked Questions (FAQs)\n{faqs}"
    )

    # 11 Fee Structure & Scholarships (COMPLETE NOTICES & PDF LINKS)
    fees = read_doc("Admission", "fee_structure.txt")
    kb["11_fee_structure_and_scholarships.txt"] = fees

    # 12 Hostels, Wardens & Mess Charges
    hostel1 = read_doc("Student_Life", "Facilities", "hostels.txt")
    hostel2 = read_doc("Student_Life", "hostels.txt")
    anti_rag = read_doc("Student_Life", "Students_Grievances_and_Counselling", "anti_ragging.txt")
    kb["12_hostels_wardens_facilities_and_fees.txt"] = (
        f"# Hostels, Accommodation, Wardens & Mess Details\n\n"
        f"{hostel1}\n\n"
        f"## Additional Hostel Contacts & Information\n{hostel2}\n\n"
        f"## Anti-Ragging Policy & Regulations\n{anti_rag}"
    )

    # 13 Civil Engineering Department
    civil_about = read_doc("Academic", "School&Centre", "civil_department", "about_civil_department.txt")
    civil_labs = read_doc("Academic", "School&Centre", "civil_department", "laboratory.txt")
    civil_achieve = read_doc("Academic", "School&Centre", "civil_department", "achievements.txt")
    civil_fac = read_doc("Academic", "School&Centre", "civil_department", "faculty_profiles.txt")
    kb["13_department_civil_engineering.txt"] = (
        f"# Department of Civil Engineering\n\n"
        f"{civil_about}\n\n"
        f"## Laboratories\n{civil_labs}\n\n"
        f"## Department Achievements & Consultancy\n{civil_achieve}\n\n"
        f"## Faculty Profiles\n{civil_fac}"
    )

    # 14 Information Technology Department
    it_about = read_doc("Academic", "School&Centre", "information_technology_department", "about_it_department.txt")
    it_labs = read_doc("Academic", "School&Centre", "information_technology_department", "laboratory.txt")
    it_fac = read_doc("Academic", "School&Centre", "information_technology_department", "faculty_profiles.txt")
    it_events = read_doc("Academic", "School&Centre", "information_technology_department", "departmental_events.txt")
    it_rd = read_doc("Academic", "School&Centre", "information_technology_department", "rd_activities.txt")
    kb["14_department_information_technology.txt"] = (
        f"# Department of Information Technology (IT)\n\n"
        f"{it_about}\n\n"
        f"## Laboratories\n{it_labs}\n\n"
        f"## Faculty Profiles\n{it_fac}\n\n"
        f"## Departmental Events & Workshops\n{it_events}\n\n"
        f"## R&D Activities\n{it_rd}"
    )

    # 15 Prominent Alumni & MoUs
    alumni = read_doc("Training_and_Placement", "prominent_alumni.txt")
    mous = read_doc("R&D", "mous_and_collaborations.txt")
    aviation = read_doc("R&D", "aviation_training.txt")
    startup = read_doc("R&D", "startup_innovation_incubation_cell.txt")
    kb["15_prominent_alumni_and_mous.txt"] = (
        f"# Prominent Alumni, Corporate MoUs & Innovation\n\n"
        f"## Distinguished Alumni of MITS Gwalior\n{alumni}\n\n"
        f"## Corporate & Academic MoUs\n{mous}\n\n"
        f"## Aviation & Drone Training Academy\n{aviation}\n\n"
        f"## Startup, Innovation & Incubation Cell\n{startup}"
    )

    return kb

def main():
    kb = generate_domains()
    print(f"Generated {len(kb)} consolidated knowledge domains from documents database.")
    
    # 1. Write backend/app/knowledge_base_data.py
    kb_py_path = backend_dir / "app" / "knowledge_base_data.py"
    with open(kb_py_path, "w", encoding="utf-8") as f:
        f.write("# Consolidated MITS Gwalior Knowledge Base Data\n")
        f.write("# Automatically generated from updated documents directory.\n\n")
        f.write("PREDEFINED_KNOWLEDGE_BASE = ")
        f.write(repr(kb))
        f.write("\n")
    print(f"Saved: {kb_py_path} ({kb_py_path.stat().st_size:,} bytes)")
    
    # 2. Write frontend/src/data/predefinedKnowledgeBase.json
    frontend_json_path = root_dir / "frontend" / "src" / "data" / "predefinedKnowledgeBase.json"
    if frontend_json_path.parent.exists():
        with open(frontend_json_path, "w", encoding="utf-8") as f:
            json.dump(kb, f, indent=2, ensure_ascii=False)
        print(f"Saved: {frontend_json_path} ({frontend_json_path.stat().st_size:,} bytes)")

if __name__ == "__main__":
    main()
