import { RenderBlocks } from '@/blocks/RenderBlocks'

export const ContainerBlockComponent = ({
  layout,
  fullWidthBlocks,
  leftColumn,
  rightColumn,
}: any) => {
  return (
    <section className="mx-auto px-4 py-6">

      {/* FULL WIDTH */}
      {layout === 'full' && (
        <RenderBlocks blocks={fullWidthBlocks} />
      )}

      {/* 50 / 50 */}
      {layout === 'half' && (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <RenderBlocks blocks={leftColumn} />
          </div>
          <div className="w-full md:w-1/2">
            <RenderBlocks blocks={rightColumn} />
          </div>
        </div>
      )}

      {/*  LEFT FIXED (33%) */}
      {layout === 'leftFixed' && (
        <div className="flex flex-wrap gap-6">
          <div
            className="w-full md:w-1/3 min-w-0"
            // style={{ flex: '0 0 calc(33.333% - 15px)' }}
          >
            <RenderBlocks blocks={leftColumn} />
          </div>

          <div className="flex-1 min-w-0">
            <RenderBlocks blocks={rightColumn} />
          </div>
        </div>
      )}

      {/*  RIGHT FIXED (33%) */}
      {layout === 'rightFixed' && (
        <div className="flex flex-wrap gap-6">
          <div className="flex-1 min-w-0">
            <RenderBlocks blocks={leftColumn} />
          </div>

          <div
            className="w-full md:w-1/3 min-w-0"
            // style={{ flex: '0 0 calc(33.333% - 15px)' }}
          >
            <RenderBlocks blocks={rightColumn} />
          </div>
        </div>
      )}
    </section>
  )
}
