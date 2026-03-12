import styles from './styles.module.css';

const EquipoInfoTeamView = ({ members, onMemberClick }) => {
  const handleMemberClick = (member) => {
    if (onMemberClick && typeof onMemberClick === 'function') {
      onMemberClick(member);
    }
  };

  const getMemberImage = (member) => {
    return ("/api"+ member?.img) || "";
  };

  return (
    <div className={styles.teamContainer}>
      <div className={styles.membersGrid}>
        {members.map((member, idx) => (
          <div
            key={idx}
            className={styles.memberCard}
            onClick={() => handleMemberClick(member)}
            role="button"
          >
            <div className={styles.imageWrapper}>
              <img
                src={getMemberImage(member)}
                alt={member.name || 'Miembro del equipo'}
                className={styles.memberImage}
              />
            </div>
            <div className={styles.memberInfo}>
              <h3 className={styles.memberName}>{member.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { EquipoInfoTeamView };