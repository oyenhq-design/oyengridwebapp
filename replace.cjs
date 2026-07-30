const fs = require('fs');
const path = require('path');

const files = [
    'src/App.jsx',
    'src/components/AnnouncementsTab.jsx',
    'src/components/LearnersTab.jsx',
    'src/components/SessionsTab.jsx',
    'src/components/ReportsTab.jsx',
    'src/components/ProgramDetail.jsx',
    'src/components/ProgramsTab.jsx'
];

// Instead of string replacement which is very risky, I'll only replace known user-visible strings:
const exactReplacements = [
    // JSX Text
    { from: '>Learner<', to: '>Participant<' },
    { from: '>Learners<', to: '>Participants<' },
    { from: '> Learner <', to: '> Participant <' },
    { from: '> Learners <', to: '> Participants <' },
    { from: '>Enrolled Learners<', to: '>Enrolled Participants<' },
    
    // Labels, Titles, Descs, Placeholders, text
    { from: 'label: \'Learners\'', to: 'label: \'Participants\'' },
    { from: 'label: "Learners"', to: 'label: "Participants"' },
    { from: 'tab: \'Learners\'', to: 'tab: \'Learners\'' }, // keep intact, just to be safe it doesn't break
    { from: '"Participant / Learner"', to: '"Participant"' },
    { from: "'Add Learners'", to: "'Add Participants'" },
    { from: "'Invite Learners'", to: "'Invite Participants'" },
    { from: "'Manage Learners'", to: "'Manage Participants'" },
    { from: "'No learners found'", to: "'No participants found'" },
    { from: "'Learners can join'", to: "'Participants can join'" },
    { from: "'Learner Report'", to: "'Participant Report'" },
    { from: "'Learner Engagement'", to: "'Participant Engagement'" },
    { from: "'Learner Engagement distribution'", to: "'Participant Engagement distribution'" },
    { from: "'Top Active Learners'", to: "'Top Active Participants'" },
    { from: "'Learners Enrolled'", to: "'Participants Enrolled'" },
    { from: 'placeholder="Search learners..."', to: 'placeholder="Search participants..."' },
    { from: 'desc: \'Evaluate learner progress using:\'', to: 'desc: \'Evaluate participant progress using:\'' },
    { from: "'4 learners have not attended in 14 days'", to: "'4 participants have not attended in 14 days'" },
    
    // Inside strings (using regex for flexibility on whitespace/quotes)
    { regex: /`\$\{wsLearners\.length\} \/ 50 Enrolled`/g, to: '`${wsLearners.length} / 50 Enrolled`' }, // No change needed if it doesn't say learners
    { regex: /`\$\{wsLearners\.length\} Learners`/g, to: '`${wsLearners.length} Participants`' },
    
    // Some general text in tags or strings
    { regex: /all learners enrolled in this program/gi, to: 'all participants enrolled in this program' },
    { regex: /all learners in this program/gi, to: 'all participants in this program' },
    { regex: /Evaluate learner progress/g, to: 'Evaluate participant progress' },
    { regex: /alert learners about/g, to: 'alert participants about' },
    { regex: /before inviting learners/g, to: 'before inviting participants' },
    { regex: /links for learners/g, to: 'links for participants' },
    { regex: /evaluate learner performance/g, to: 'evaluate participant performance' },
    { regex: /No learners enrolled/g, to: 'No participants enrolled' },
    { regex: />Register New Learner</g, to: '>Register New Participant<' },
    { regex: />Learners Directory</g, to: '>Participants Directory<' },
    { regex: /Invite learners\./gi, to: 'Invite participants.' },
    { regex: />Invite learners</gi, to: '>Invite participants<' },
    { regex: /invite more learners/gi, to: 'invite more participants' },
    { regex: /organizing learners/g, to: 'organizing participants' },
    { regex: /programmes, learners, sessions/g, to: 'programmes, participants, sessions' },
    { regex: /start enrolling learners/g, to: 'start enrolling participants' },
    { regex: /'Learners', 'Sessions'/g, to: "'Participants', 'Sessions'" },
    { regex: /'Overview', 'Sessions', 'Learners'/g, to: "'Overview', 'Sessions', 'Participants'" },
    { regex: /'Overview', 'Learners'/g, to: "'Overview', 'Participants'" },
    { regex: /'👥 Learners'/g, to: "'👥 Participants'" },
    { regex: /'2\. Invite Learners'/g, to: "'2. Invite Participants'" },
    { regex: /assigned learners/g, to: 'assigned participants' },
    { regex: /successfully registered \$\{newLearnerName\}/g, to: 'successfully registered ${newLearnerName}' }, // no change needed
];

for (const f of files) {
    const p = path.join('c:/Users/ProjectPC/Desktop/oyengridwebapp', f);
    let content = fs.readFileSync(p, 'utf-8');
    
    for (const rep of exactReplacements) {
        if (rep.from) {
            content = content.split(rep.from).join(rep.to);
        } else if (rep.regex) {
            content = content.replace(rep.regex, rep.to);
        }
    }
    
    // Let's do a few more safe global replaces with word boundaries for user text
    // Replace 'Learner ' -> 'Participant ' inside tags or specific strings
    // Actually, exact replacements covers almost all of them. Let's do one pass over lines and replace Learner -> Participant if it's inside > <
    
    let lines = content.split('\n');
    lines = lines.map(line => {
        // Find text between > and <
        return line.replace(/>([^<]+)</g, (match, text) => {
            let newText = text.replace(/\bLearners\b/g, 'Participants')
                              .replace(/\blearners\b/g, 'participants')
                              .replace(/\bLearner\b/g, 'Participant')
                              .replace(/\blearner\b/g, 'participant');
            return `>${newText}<`;
        });
    });
    content = lines.join('\n');
    
    fs.writeFileSync(p, content, 'utf-8');
}
console.log('Replacements completed.');
