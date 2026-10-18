# UCI Student Performance Dataset

This directory documents the public benchmark dataset used by **EduExplain AI**.

---

## 1. Dataset Overview

The **Student Performance Data Set** was collected by Paulo Cortez and Alice Silva (2008) at the University of Minho, Portugal. It models student achievement in secondary education at two Portuguese public schools (*Escola Secundária Gabriel Pereira* and *Escola Secundária de Mousinho da Silveira*) during the 2005-2006 academic year.

- **Official UCI Repository Record:** [https://archive.ics.uci.edu/dataset/320/student+performance](https://archive.ics.uci.edu/dataset/320/student+performance)
- **Digital Object Identifier (DOI):** 10.24432/C5TG7T
- **License:** Creative Commons Attribution 4.0 International (CC BY 4.0). Permitted for open research, educational evaluation, and benchmark modeling.

---

## 2. Dataset Files

| File | Description | Instances | Features | Role in EduExplain AI |
| :--- | :--- | :--- | :--- | :--- |
| `student-mat.csv` | Secondary Mathematics course records | 395 | 33 | **Primary training & evaluation benchmark** |
| `student-por.csv` | Secondary Portuguese language course records | 649 | 33 | Supplementary domain benchmark |
| `student.txt` | Original attribute dictionary and metadata | — | — | Feature documentation |

---

## 3. Features Modeled (19 Predictors)

EduExplain AI models 19 publicly available attributes:

1. **Academic Trajectory:**
   - `G1`: First period grade (continuous integer, 0-20 scale)
   - `G2`: Second period grade (continuous integer, 0-20 scale)
   - `failures`: Number of past class failures ($n$ if $1 \le n < 3$, else 4)
2. **Study Habits & Attendance:**
   - `studytime`: Weekly study time (1: <2h, 2: 2-5h, 3: 5-10h, 4: >10h)
   - `absences`: Number of school absences (0 to 93 days)
3. **Institutional & Family Support:**
   - `schoolsup`: Extra educational school support (binary: yes/no)
   - `famsup`: Family educational support (binary: yes/no)
   - `paid`: Extra paid subject classes/tutoring (binary: yes/no)
4. **Social & Personal Factors:**
   - `activities`: Extracurricular activities (binary: yes/no)
   - `higher`: Wants to pursue higher education (binary: yes/no)
   - `internet`: Internet access at home (binary: yes/no)
   - `romantic`: With a romantic relationship (binary: yes/no)
   - `Medu`: Mother's education (0: none, 1: primary, 2: 5th-9th, 3: secondary, 4: higher)
   - `Fedu`: Father's education (0: none, 1: primary, 2: 5th-9th, 3: secondary, 4: higher)
   - `traveltime`: Home to school travel time (1: <15m, 2: 15-30m, 3: 30-60m, 4: >60m)
   - `freetime`: Free time after school (1: very low to 5: very high)
   - `goout`: Going out with friends (1: very low to 5: very high)
   - `health`: Current health status (1: very bad to 5: very good)
   - `age`: Student age (15 to 22 years)

---

## 4. Target Variable Formulation

Under the Portuguese grading system, final achievement is graded on a 0 to 20 integer scale, with 10 representing the statutory passing threshold:

- **Higher Risk (G3 < 10):** Failing academic performance; priority candidate for early targeted mentoring.
- **Moderate Risk (10 <= G3 <= 13):** Satisfactory passing, but borderline/vulnerable to academic disruption.
- **Lower Concern (G3 >= 14):** Proficient to superior academic performance.

---

## 5. Academic Citation

```bibtex
@inproceedings{cortez2008using,
  title={Using data mining to predict secondary school student performance},
  author={Cortez, Paulo and Silva, Alice Maria Gon{\c{c}}alves},
  booktitle={Proceedings of 5th Annual Future Business Technology Conference (FUBUTEC 2008)},
  pages={5--12},
  year={2008},
  organization={EUROSIS}
}
```
