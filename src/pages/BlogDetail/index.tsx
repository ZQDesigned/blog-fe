import GameModal from '../../components/GameModal';
import { useGameEasterEgg } from '../../hooks/useGameEasterEgg';

const BlogDetail: React.FC = () => {
  const { showGameModal, handleCloseGameModal } = useGameEasterEgg();

  return (
    <>
      <GameModal open={showGameModal} onClose={handleCloseGameModal} />
    </>
  );
};

export default BlogDetail; 