/**
 * 🎉 Festival Countdown Planner - Module Pattern
 *
 * Indian festivals ka planner bana! Module pattern use karna hai —
 * matlab ek function jo ek object return kare jisme public methods hain,
 * lekin andar ka data PRIVATE rahe (bahar se directly access na ho sake).
 *
 * Function: createFestivalManager()
7 *
 * Returns an object with these PUBLIC methods:
 *
 *   - addFestival(name, date, type)
 *     date is "YYYY-MM-DD" string, type is "religious"/"national"/"cultural"
 *     Returns new total count of festivals
 *     Agar name empty or date not string or invalid type, return -1
 *     No duplicate names allowed (return -1 if exists)
 *
 *   - removeFestival(name)
 *     Returns true if removed, false if not found
 *
 *   - getAll()
 *     Returns COPY of all festivals array (not the actual private array!)
 *     Each festival: { name, date, type }
 *
 *   - getByType(type)
 *     Returns filtered array of festivals matching type
 *
 *   - getUpcoming(currentDate, n = 3)
 *     currentDate is "YYYY-MM-DD" string
 *     Returns next n festivals that have date >= currentDate
 *     Sorted by date ascending
 *
 *   - getCount()
 *     Returns total number of festivals
 *
 * PRIVATE STATE: festivals array should NOT be accessible from outside.
 *   manager.festivals should be undefined.
 *   getAll() must return a COPY so modifying it doesn't affect internal state.
 *   Two managers should be completely independent.
 *
 * Hint: This is the Module Pattern — a function that returns an object
 *   of methods, all closing over shared private variables.
 *
 * @example
 *   const mgr = createFestivalManager();
 *   mgr.addFestival("Diwali", "2025-10-20", "religious");   // => 1
 *   mgr.addFestival("Republic Day", "2025-01-26", "national"); // => 2
 *   mgr.getAll(); // => [{ name: "Diwali", ... }, { name: "Republic Day", ... }]
 *   mgr.getUpcoming("2025-01-01", 1); // => [{ name: "Republic Day", ... }]
 */
export function createFestivalManager() {
  let festiveObj = [];

  return {
    addFestival(name, date, type) {
      if (name.trim() == "" || typeof date !== 'string') return -1;
      if (type !== "religious" && type !== "national" && type !== "cultural") return -1;

      for (let i = 0; i < festiveObj.length; i++) {
        if (festiveObj[i].name === name) return -1;
        else continue
      };

      festiveObj.push({ name, date, type })

      return festiveObj.length
    },
    removeFestival(name) {
      let ifFound = festiveObj.findIndex(festival => festival.name === name)
      if (ifFound === -1) return false;

      festiveObj.splice(ifFound, 1)

      return true;
    },
    getAll() {
      let festiveObjCopy = [...festiveObj];
      return festiveObjCopy
    },
    getByType(type) {
      let filteredObj = festiveObj.filter(festival => festival.type === type)
      return filteredObj
    },
    getUpcoming(currentDate, n = 3) {
      let obj = [];
      const date1 = new Date(currentDate)
      for (let i = 0; i < festiveObj.length; i++) {
        const festiveDate = new Date(festiveObj[i].date)
        if (festiveDate >= date1) obj.push(festiveObj[i])
      }

      obj.sort((a, b) => new Date(a.date) - new Date(b.date))

      return obj.slice(0, n)
    },
    getCount() {
      return festiveObj.length
    }
  }
}
