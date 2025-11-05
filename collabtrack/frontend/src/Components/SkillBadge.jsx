import React from 'react';

const SkillBadge = ({ skill }) => {
  return (
    <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
      {skill}
    </span>
  );
};

export default SkillBadge;