import { prisma } from "../lib/prisma";

//CREATE LOG ENTRY

export const createLog = async (req, res, next) => {
  try {
    const Log = await prisma.logEntry.create({
      data: req.body,
    });

    res.status(201).json({
      status: "success",
      data: {
        Log,
      },
    });
  } catch (error) {
    res.status(500).json({
      name: error.name,
      message: error.message,
    });
  }
};

//RETRIEVE ALL LOG ENTRIES
export const retrieveLog = async (req, res, next) => {
  try {
    const logs = await prisma.logEntry.findMany();

    res.status(200).json({
      status: "success",
      results: logs.length,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};


//UPDATE LOG ENTRY

export const updateLog = async (req, res, next) => {

  try {

    const { id } = req.params;

    const updateLog = await prisma.logEntry.update({

        where: { id: Number(id) },
        data: req.body,

    });

    res.status(200).json({
        status: 'success',
        data: {
            updateLog,
        }
    })


  } catch (error) {
    res.status(400).json({
      name: error.name,
      message: error.message,
    });
  }
};


//DELETE LOG ENTRY

export const deleteLog = async (req, res, next) => {

    try {
        
        const { id } = req.params;

        await prisma.logEntry.delete({
            where: { id: Number(id) }
        });
        res.status(204).json({
            status: 'success',
            data: null,
        })
        
    } catch (error) {
        res.status(400).json({
        name: error.name,
        message: error.message
        });
    }
}
