import { prisma } from "../lib/prisma";

//CREATE LOG ENTRY

export const createLog = async (req, res, next) => {
  try {

    const { department , personWithProblem, problem, solution, solvedBy, status} = req.body;

    if (!department || !personWithProblem || !problem || !solution || !solvedBy || !status) {
      return res.status(400).json({
        status: "fail",
        message: "All fields are required"
      });
    }

    const Log = await prisma.logEntry.create({
      data: { department, personWithProblem, problem, solution, solvedBy, status }
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


//RETRIEVE A SINGLE LOG

export const getLog = async (req, res, next) => {

  try {

    // get id from params
    const { id } = req.params;

    //Find log in db using id

    const log = await prisma.logEntry.findUnique({
      where: { id : Number(id)}
    })

    //If log not found , return 404

    if (!log) {
      return res.status(404).json({
          status: "fail",
          message: "Log not found"
        });
    }

    //Return log entry

    return res.status(200).json({
      status: "success",
      data: log
    });


  } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Failed to retrieve log"
      });
  }
}


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

        const log = await prisma.logEntry.findUnique({
          where : { id: Number(id)}
        })

        
        if (!log) {
          return res.status(404).json({
            status: "fail",
            message: "Log not found"
          })
        }


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
