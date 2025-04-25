function updateSelectedRecords(primaryControl, selectedIds) {
    if (!selectedIds || selectedIds.length === 0) {
        Xrm.Navigation.openAlertDialog({ text: "Please select at least one record." });
        return;
    }

    // Disable navigation while processing
    Xrm.Utility.showProgressIndicator("Updating selected records...");

    const entityName = "new_entity"; // Replace with your actual entity name
    const optionSetField = "new_status";
    const optionSetValue = 2;

    const updatePromises = selectedIds.map(id => {
        const entity = {};
        entity[optionSetField] = optionSetValue;

        return Xrm.WebApi.updateRecord(entityName, id, entity)
            .then(() => ({ id, success: true }))
            .catch(error => ({ id, success: false, error }));
    });

    Promise.all(updatePromises)
        .then(results => {
            const failed = results.filter(r => !r.success);

            if (failed.length > 0) {
                let errorMessage = "One or more records failed to update.";
                Xrm.Navigation.openAlertDialog({ text: errorMessage });
            } else {
                Xrm.Navigation.openAlertDialog({ text: "All selected records updated successfully." });
            }
        })
        .finally(() => {
            // Re-enable navigation
            Xrm.Utility.closeProgressIndicator();
        });
}
