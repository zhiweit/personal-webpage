import Chip from "@mui/material/Chip";

interface Props {
  chipLabels: string[]
  onDelete: (updatedChipLabels: string[]) => void
  className?: string
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'default'
}

export default function handler({ chipLabels, onDelete, className, color='default' }: Props) {

  return (
    <>
      <div className={className}>
        {chipLabels.map((technology, index) => (
          <Chip key={index} className='m-1'
            label={technology} color={color}
            size="small"
            onDelete={(event) => {
              const updatedChipLabels = chipLabels.filter((t, i) => i !== index)
              onDelete(updatedChipLabels) // update parent state
            }}
          />
        ))}
      </div>
    </>
  )
}