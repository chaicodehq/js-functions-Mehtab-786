/**
 * 🗳️ Panchayat Election System - Capstone
 *
 * Village ki panchayat election ka system bana! Yeh CAPSTONE challenge hai
 * jisme saare function concepts ek saath use honge:
 * closures, callbacks, HOF, factory, recursion, pure functions.
 *
 * Functions:
 *
 *   1. createElection(candidates)
 *      - CLOSURE: private state (votes object, registered voters set)
 *      - candidates: array of { id, name, party }
 *      - Returns object with methods:
 *
 *      registerVoter(voter)
 *        - voter: { id, name, age }
 *        - Add to private registered set. Return true.
 *        - Agar already registered or voter invalid, return false.
 *        - Agar age < 18, return false.
 *
 *      castVote(voterId, candidateId, onSuccess, onError)
 *        - CALLBACKS: call onSuccess or onError based on result
 *        - Validate: voter registered? candidate exists? already voted?
 *        - If valid: record vote, call onSuccess({ voterId, candidateId })
 *        - If invalid: call onError("reason string")
 *        - Return the callback's return value
 *
 *      getResults(sortFn)
 *        - HOF: takes optional sort comparator function
 *        - Returns array of { id, name, party, votes: count }
 *        - If sortFn provided, sort results using it
 *        - Default (no sortFn): sort by votes descending
 *
 *      getWinner()
 *        - Returns candidate object with most votes
 *        - If tie, return first candidate among tied ones
 *        - If no votes cast, return null
 *
 *   2. createVoteValidator(rules)
 *      - FACTORY: returns a validation function
 *      - rules: { minAge: 18, requiredFields: ["id", "name", "age"] }
 *      - Returned function takes a voter object and returns { valid, reason }
 *
 *   3. countVotesInRegions(regionTree)
 *      - RECURSION: count total votes in nested region structure
 *      - regionTree: { name, votes: number, subRegions: [...] }
 *      - Sum votes from this region + all subRegions (recursively)
 *      - Agar regionTree null/invalid, return 0
 *
 *   4. tallyPure(currentTally, candidateId)
 *      - PURE FUNCTION: returns NEW tally object with incremented count
 *      - currentTally: { "cand1": 5, "cand2": 3, ... }
 *      - Return new object where candidateId count is incremented by 1
 *      - MUST NOT modify currentTally
 *      - If candidateId not in tally, add it with count 1
 *
 * @example
 *   const election = createElection([
 *     { id: "C1", name: "Sarpanch Ram", party: "Janata" },
 *     { id: "C2", name: "Pradhan Sita", party: "Lok" }
 *   ]);
 *   election.registerVoter({ id: "V1", name: "Mohan", age: 25 });
 *   election.castVote("V1", "C1", r => "voted!", e => "error: " + e);
 *   // => "voted!"
 */
export function createElection(candidates) {
  let registeredVoters = []
  let voterRecord = {}
  let voteTally = {}

  return {
    registerVoter(voter) {
      if (voter === null || typeof voter !== 'object' || Array.isArray(voter) ) return false;
      if(!voter.age || voter.age < 18) return false;
      let isVoterRegistered = registeredVoters.filter(person => person.id === voter.id)
      if (isVoterRegistered.length >= 1) return false;

      registeredVoters.push(voter);
      return true
    },
    castVote(voterId, candidateId, onSuccess, onError) {
      let candidateIdx = registeredVoters.findIndex(voter => voter.id === voterId);
      if (candidateIdx == -1) return onError('Voter not registered');
      let ifcandidateExist = candidates.findIndex(candidate => candidate.id === candidateId)
      if (ifcandidateExist == -1) return onError('Invalid candidate');
      if (voterRecord.hasOwnProperty(voterId)) return onError("Already voted");

      voterRecord[voterId] = candidateId;
      voteTally[candidateId] = (voteTally[candidateId] || 0) + 1;
      return onSuccess({ voterId, candidateId })
    },
    getResults(sortFn) {
      let results = candidates.map(candidate => {
        let newObj = { ...candidate, votes: (voteTally[candidate.id] || 0) }
        return newObj
      })
      if (sortFn) {
        return results.sort(sortFn)
      } else {
        return results.sort((a, b) => b.votes - a.votes)
      }
    },
    getWinner() {
      let winnerCandidateId = null;
      let winnerTotal = 0
      for (const key in voteTally) {
        if (voteTally[key] > winnerTotal) {
          winnerCandidateId = key
          winnerTotal = voteTally[key]
        }
      }
      if (winnerCandidateId === null) return null;
      let winnerCandidate = candidates.find(candid => candid.id === winnerCandidateId)
      return winnerCandidate
    }
  }
}

export function createVoteValidator(rules) {
  return function (voter) {
    for (let i = 0; i < rules.requiredFields.length; i++) {
      let field = rules.requiredFields[i]
      if (voter[field] === null || Number.isNaN(voter[field])) {
        return { valid: false, reason: `Missing ${field}` };
      }
    }
    if (!voter.age || voter.age < rules.minAge) return { valid: false, reason: 'Not eligible voter' };

    return { valid: true, reason: "" }
  }
}

export function countVotesInRegions(regionTree) {
  if (regionTree == null || typeof regionTree !== 'object' || Array.isArray(regionTree)) return 0;
  let totalVotes = regionTree.votes || 0;
  for (let i = 0; i < regionTree.subRegions.length; i++) {
    totalVotes += countVotesInRegions(regionTree.subRegions[i])
  }
  return totalVotes
}

export function tallyPure(currentTally, candidateId) {
  let currentTallyCopy = { ...currentTally }
  currentTallyCopy[candidateId] = (currentTallyCopy[candidateId] || 0) + 1;
  return currentTallyCopy
}
